<?php

namespace App\Http\Middleware;

use App\Models\Funcionario;
use App\Services\JwtService;
use App\Traits\ApiResponse;
use Closure;
use Firebase\JWT\ExpiredException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use UnexpectedValueException;

class JwtAuth
{
    use ApiResponse;

    public function handle(Request $request, Closure $next): Response
    {
        $header = (string) $request->header('Authorization', '');

        if (! str_starts_with($header, 'Bearer ')) {
            return $this->jsonError('Token não fornecido.', 401);
        }

        $token = substr($header, 7);

        try {
            $claims = app(JwtService::class)->validar($token);
        } catch (ExpiredException) {
            return $this->jsonError('Sessão expirada, faça login novamente.', 401);
        } catch (UnexpectedValueException) {
            return $this->jsonError('Token inválido.', 401);
        }

        $funcionario = Funcionario::find($claims->sub);

        if (! $funcionario || $funcionario->status !== 'ativo') {
            return $this->jsonError('Token inválido ou não fornecido.', 401);
        }

        $request->setUserResolver(fn () => $funcionario);

        return $next($request);
    }
}
