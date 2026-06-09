<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;

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
        'creado_en',
        'hora_creado',
        'estado',
        'observacion_rechazo',
        'revisado_por',
        'fecha_revision',
        'fk_user',
        'nombre_eps',
        'imagenes',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'fk_user', 'id');
    }
}
