<?php

namespace App\Services;

use App\Models\Funcionario;
use App\Support\AccessScope;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Emissão/validação de token — mesmo padrão do RondaSocial (firebase/php-jwt, HS256).
class JwtService
{
    private string $secret;
    private int $ttl;

    public function __construct()
    {
        $this->secret = (string) config('hub.jwt_secret');
        $this->ttl = (int) config('hub.jwt_ttl');
    }

    public function emitir(Funcionario $funcionario): array
    {
        $now = time();
        $expira = $now + $this->ttl;

        $sistemas = AccessScope::sistemasVisiveis($funcionario)->pluck('slug')->values()->all();

        $payload = [
            'sub' => (string) $funcionario->id,
            'iat' => $now,
            'exp' => $expira,
            'papel' => $funcionario->papel,
            'setor_id' => $funcionario->setor_id,
            'setor_gestao_id' => $funcionario->setor_gestao_id,
            'sistemas' => $sistemas,
        ];

        return [
            'token' => JWT::encode($payload, $this->secret, 'HS256'),
            'expira_em' => $expira,
        ];
    }

    // Lança Firebase\JWT\{ExpiredException,SignatureInvalidException,UnexpectedValueException} em caso de falha.
    public function validar(string $token): object
    {
        return JWT::decode($token, new Key($this->secret, 'HS256'));
    }
}
