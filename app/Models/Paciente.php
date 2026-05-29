<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $primaryKey = 'id_paciente';
    public $timestamps = false;

    protected $fillable = [
        'nombre_completo',
        'tipo_documento',
        'numero_documento',
        'edad',
        'sexo',
        'fecha_nacimiento',
        'fecha_diagnostico',
        'telefono',
        'telefono2',
        'correo',
        'historia_clinica',
        'patologia',
    ];
}
