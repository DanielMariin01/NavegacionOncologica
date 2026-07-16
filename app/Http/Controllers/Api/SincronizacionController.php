<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\Request;

class SincronizacionController extends Controller
{
    /**
     * Devuelve los pacientes que aún no han sido sincronizados
     * hacia AuroraPro.
     */
    public function pacientesPendientes()
    {
        $pacientes = Paciente::where('sincronizado', false)
            ->orderBy('id_paciente', 'asc')
            ->get();

        return response()->json($pacientes);
    }

    /**
     * Marca como sincronizados los pacientes cuyos IDs
     * fueron recibidos correctamente por AuroraPro.
     */
    public function marcarSincronizados(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        Paciente::whereIn('id_paciente', $request->ids)
            ->update(['sincronizado' => true]);

        return response()->json(['success' => true]);
    }

    public function crearUsuario(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
            'nombre_eps' => 'nullable|string',
        ]);

        \App\Models\User::updateOrCreate(
            ['id' => $request->id],
            [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'nombre_eps' => $request->nombre_eps,
            ]
        );

        return response()->json(['success' => true]);
    }
}
