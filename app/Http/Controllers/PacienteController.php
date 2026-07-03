<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PacienteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre1'          => 'required|string|max:100',
            'nombre2'          => 'nullable|string|max:100',
            'apellido1'        => 'required|string|max:100',
            'apellido2'        => 'nullable|string|max:100',
            'tipo_documento'   => 'required|string',
            'numero_documento' => 'required|string|unique:pacientes,numero_documento',
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

        Paciente::create($datos);

        return redirect()->back()->with('success', 'Paciente registrado correctamente.');
    }
}
