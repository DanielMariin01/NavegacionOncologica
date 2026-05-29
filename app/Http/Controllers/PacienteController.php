<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre_completo'  => 'required|string|max:255',
            'tipo_documento'   => 'required|string',
            'numero_documento' => 'required|string|unique:pacientes,numero_documento',
            'edad'             => 'required|integer',
            'sexo'             => 'required|string',
            'fecha_nacimiento' => 'required|date',
            'fecha_diagnostico' => 'nullable|date',
            'telefono'         => 'required|string',
            'telefono2'        => 'nullable|string',
            'correo'           => 'nullable|email',
            'historiaClinica'   => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'patologia'        => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $datos = $request->except(['historiaClinica', 'patologia']);
        $datos['creado_en'] = now()->format('Y-m-d');
        $datos['hora_creado'] = now()->format('H:i:s');

        if ($request->hasFile('historiaClinica')) {
            $datos['historia_clinica'] = $request->file('historiaClinica')
                ->store('pacientes/historias', 'local');
        }

        if ($request->hasFile('patologia')) {
            $datos['patologia'] = $request->file('patologia')
                ->store('pacientes/patologias', 'local');
        }

        Paciente::create($datos);

        return redirect()->back()->with('success', 'Paciente registrado correctamente.');
    }
}
