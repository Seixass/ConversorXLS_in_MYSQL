<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Uso: ->middleware('role:admin') ou ->middleware('role:gestor,admin')
// Deve rodar sempre depois de 'jwt.auth'.
class RequireRole
{
    use ApiResponse;

    public function handle(Request $request, Closure $next, string ...$papeis): Response
    {
        $usuario = $request->user();

        if (! $usuario || ! in_array($usuario->papel, $papeis, true)) {
            return $this->jsonError('Sem permissão para esta ação.', 403);
        }

        return $next($request);
    }
}
