<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerificarTokenSincronizacion
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-Sync-Token');

        if ($token !== env('SYNC_TOKEN_SECRETA')) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        return $next($request);
    }
}
