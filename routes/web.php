<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\Api\SincronizacionController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('formulario');
    }
    return redirect()->route('login');
});

Route::get('/formulario', function () {
    return Inertia::render('Formulario');
})->middleware(['auth', 'verified'])->name('formulario');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/paciente', [PacienteController::class, 'store'])
    ->name('paciente.store')
    ->middleware('auth');

Route::get('/paciente/verificar/{numeroDocumento}', [PacienteController::class, 'checkDocumento'])
    ->name('paciente.check')
    ->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//RUTA PARA SERVIR LOS ARCHIVOS 
Route::get('/archivo/{tipo}/{archivo}', function ($tipo, $archivo) {
    $clave = request()->header('X-Archivo-Clave');

    if ($clave !== env('ARCHIVO_CLAVE_SECRETA')) {
        abort(403, 'No autorizado');
    }

    $ruta = storage_path("app/pacientes/{$tipo}/{$archivo}");

    if (!file_exists($ruta)) {
        abort(404, 'Archivo no encontrado');
    }

    return response()->file($ruta);
})->middleware('auth');

//RUTA PARA SINCRONIZAR LOS PACIENTES PENDIENTES CON EL SISTEMAS DE AURORAPRO
Route::middleware('sync.token')->prefix('api')->group(function () {
    Route::get('/pacientes-pendientes', [SincronizacionController::class, 'pacientesPendientes']);
    Route::post('/pacientes-sincronizados', [SincronizacionController::class, 'marcarSincronizados']);
    Route::post('/usuarios', [SincronizacionController::class, 'crearUsuario']);
    Route::delete('/usuarios/{id}', [SincronizacionController::class, 'eliminarUsuario']);
});

require __DIR__ . '/auth.php';
