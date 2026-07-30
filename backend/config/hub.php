<?php

return [
    // Segredo do JWT emitido pelo Hub. HS256 por ora — mesmo padrão do RondaSocial;
    // migrar para RS256 (par de chaves) é um item em aberto quando outros sistemas
    // passarem a validar o token do Hub (ver memória "project_hub_sistemas").
    'jwt_secret' => env('JWT_SECRET'),

    // Duração do token em segundos (padrão: 8h de expediente).
    'jwt_ttl' => env('JWT_TTL', 28800),
];
