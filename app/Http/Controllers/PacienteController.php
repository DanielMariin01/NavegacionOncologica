<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PacienteController extends Controller
{
    private const CONTRATOS_EPS = [
        'ASMET' => 'ESS062',
        'SOS'   => 'IPS002PGP',
    ];

    public function store(Request $request)
    {


        $request->validate([
            'nombre1'          => 'required|string|max:100',
            'nombre2'          => 'nullable|string|max:100',
            'apellido1'        => 'required|string|max:100',
            'apellido2'        => 'nullable|string|max:100',
            'tipo_documento'   => 'required|string',
            'numero_documento' => 'required|string',
            'edad'             => 'required|integer',
            'sexo'             => 'required|string',
            'fecha_nacimiento' => 'required|date',
            'fecha_diagnostico' => 'nullable|date',
            'telefono'         => 'required|string',
            'telefono2'        => 'nullable|string',
            'correo'           => 'nullable|email',
            'historiaClinica'  => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'patologia'        => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'imagenes' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ]);

        Log::info('Incidencia@store - Inicio de registro', [
            'user_id'          => Auth::id(),
            'numero_documento' => $request->input('numero_documento'),
        ]);

        $datos = $request->except(['historiaClinica', 'patologia', 'imagenes']);
        $datos['creado_en'] = now()->format('Y-m-d');
        $datos['hora_creado'] = now()->format('H:i:s');
        $datos['fk_user'] = Auth::id();
        $datos['nombre_eps'] = Auth::user()->nombre_eps;
        $datos['estado'] = 'PENDIENTE';

        if ($request->hasFile('historiaClinica')) {
            $datos['historia_clinica'] = $request->file('historiaClinica')
                ->store('pacientes/historias', 'local');
        }

        if ($request->hasFile('patologia')) {
            $datos['patologia'] = $request->file('patologia')
                ->store('pacientes/patologias', 'local');
        }

        if ($request->hasFile('imagenes')) {
            $datos['imagenes'] = $request->file('imagenes')
                ->store('pacientes/imagenes', 'local');
        }

        DB::connection('mysql')->beginTransaction();
        $sistemaFallido = null;

        try {
            $paciente = Paciente::create($datos);

            Log::info('Incidencia@store - Incidencia creada en MySQL local', [
                'id_paciente'      => $paciente->id_paciente,
                'numero_documento' => $datos['numero_documento'],
            ]);

            // ---- CAPBAS ----
            $sistemaFallido = 'CAPBAS';

            $existeEnCapbas = DB::connection('sqlsrv')
                ->table('CAPBAS')
                ->where('MPCedu', $datos['numero_documento'])
                ->exists();

            Log::info('Incidencia@store - Verificación en CAPBAS', [
                'numero_documento' => $datos['numero_documento'],
                'ya_existe_capbas'  => $existeEnCapbas,
            ]);

            if (!$existeEnCapbas) {
                DB::connection('sqlsrv')->table('CAPBAS')->insert([
                    'MPCedu'   => $datos['numero_documento'],
                    'MPTDoc'   => $datos['tipo_documento'],
                    'MPEstPac' => 'S',
                    'MPNom1'   => strtoupper($datos['nombre1']),
                    'MPNom2'   => strtoupper($datos['nombre2'] ?? ''),
                    'MPApe1'   => strtoupper($datos['apellido1']),
                    'MPApe2'   => strtoupper($datos['apellido2'] ?? ''),
                    'MPFchN'   => str_replace('-', '', $datos['fecha_nacimiento']),
                    'MPSexo'   => $datos['sexo'],
                ]);

                Log::info('Incidencia@store - Paciente creado en CAPBAS', [
                    'numero_documento' => $datos['numero_documento'],
                ]);
            }

            // ---- MAEPAC ----
            $sistemaFallido = 'MAEPAC';

            $existeEnMaepac = DB::connection('sqlsrv')
                ->table('MAEPAC')
                ->where('MPCedu', $datos['numero_documento'])
                ->exists();

            Log::info('Incidencia@store - Verificación en MAEPAC', [
                'numero_documento' => $datos['numero_documento'],
                'ya_existe_maepac'  => $existeEnMaepac,
            ]);

            if (!$existeEnMaepac) {
                $nombreEps = Auth::user()->nombre_eps;
                $codigoContrato = self::CONTRATOS_EPS[$nombreEps] ?? null;

                if (!$codigoContrato) {
                    throw new \RuntimeException("No se encontró código de contrato MENNIT para la EPS '{$nombreEps}'.");
                }
                Log::info('Incidencia@store - EPS y contrato usados para MAEPAC', [
                    'numero_documento' => $datos['numero_documento'],
                    'nombre_eps'        => $nombreEps,
                    'codigo_contrato'   => $codigoContrato,
                ]);

                DB::connection('sqlsrv')->table('MAEPAC')->insert([
                    'MPCedu' => $datos['numero_documento'],
                    'MPTDoc' => $datos['tipo_documento'],
                    'MENNIT' => $codigoContrato,
                ]);

                Log::info('Incidencia@store - Paciente creado en MAEPAC', [
                    'numero_documento' => $datos['numero_documento'],
                ]);
            }

            $sistemaFallido = null;
            DB::connection('mysql')->commit();

            Log::info('Incidencia@store - Transacción completada exitosamente', [
                'id_paciente'      => $paciente->id_paciente,
                'numero_documento' => $datos['numero_documento'],
            ]);
        } catch (\Throwable $e) {
            Log::error('Incidencia@store - Falló el registro, se revierte todo', [
                'numero_documento' => $datos['numero_documento'] ?? null,
                'sistema_fallido'  => $sistemaFallido,
                'error'            => $e->getMessage(),
            ]);

            DB::connection('mysql')->rollBack();
            foreach (['historia_clinica', 'patologia', 'imagenes'] as $campoArchivo) {
                if (!empty($datos[$campoArchivo]) && Storage::disk('local')->exists($datos[$campoArchivo])) {
                    Storage::disk('local')->delete($datos[$campoArchivo]);
                }
            }

            $mensajeError = match ($sistemaFallido) {
                'CAPBAS' => 'Ocurrió un error al registrar el paciente en CAPBAS. No se guardó ningún dato.',
                'MAEPAC' => 'Ocurrió un error al registrar el paciente en MAEPAC. No se guardó ningún dato.',
                default  => 'Ocurrió un error al registrar la incidencia. No se guardó ningún dato.',
            };

            return back()->withErrors(['general' => $mensajeError])->withInput();
        }
        return redirect()->back()->with('success', 'Paciente registrado correctamente.');
    }

    public function checkDocumento(string $numeroDocumento)
    {
        Log::info('Incidencia@checkDocumento - Verificando documento', [
            'numero_documento' => $numeroDocumento,
        ]);

        $ultimaIncidencia = Paciente::where('numero_documento', $numeroDocumento)
            ->latest('id_paciente')
            ->first();

        if ($ultimaIncidencia) {
            Log::info('Incidencia@checkDocumento - Encontrado en historial local', [
                'numero_documento' => $numeroDocumento,
            ]);

            return response()->json([
                'existe'  => true,
                'origen'  => 'local',
                'mensaje' => 'Este paciente ya ha sido registrado con incidencias anteriormente. Se autocompletaron los datos.',
                'datos'   => [
                    'tipo_documento'   => $ultimaIncidencia->tipo_documento,
                    'nombre1'          => $ultimaIncidencia->nombre1,
                    'nombre2'          => $ultimaIncidencia->nombre2,
                    'apellido1'        => $ultimaIncidencia->apellido1,
                    'apellido2'        => $ultimaIncidencia->apellido2,
                    'fecha_nacimiento' => $ultimaIncidencia->fecha_nacimiento,
                    'sexo'             => $ultimaIncidencia->sexo,
                ],
            ]);
        }

        $registroCapbas = DB::connection('sqlsrv')
            ->table('CAPBAS')
            ->where('MPCedu', $numeroDocumento)
            ->first();

        if ($registroCapbas) {
            Log::info('Incidencia@checkDocumento - Encontrado en CAPBAS', [
                'numero_documento' => $numeroDocumento,
            ]);

            return response()->json([
                'existe'  => true,
                'origen'  => 'capbas',
                'mensaje' => 'Se autocompletaron los datos.',
                'datos'   => [
                    'tipo_documento'   => trim($registroCapbas->MPTDoc),
                    'nombre1'          => trim($registroCapbas->MPNom1),
                    'nombre2'          => trim($registroCapbas->MPNom2 ?? ''),
                    'apellido1'        => trim($registroCapbas->MPApe1),
                    'apellido2'        => trim($registroCapbas->MPApe2 ?? ''),
                    'fecha_nacimiento' => $registroCapbas->MPFchN,
                    'sexo'             => trim($registroCapbas->MPSexo),
                ],
            ]);
        }

        return response()->json([
            'existe'  => false,
            'origen'  => null,
            'mensaje' => null,
            'datos'   => null,
        ]);
    }
}
