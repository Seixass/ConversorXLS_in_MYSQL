<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

// Envelope de resposta idêntico ao RondaSocial (App\Controller\Api\AppController::jsonSuccess/jsonError)
// para manter os dois sistemas consistentes.
trait ApiResponse
{
    protected function jsonSuccess(mixed $data, string $message = '', int $status = 200): JsonResponse
    {
        $body = ['success' => true, 'data' => $data];
        if ($message !== '') {
            $body['message'] = $message;
        }

        return response()->json($body, $status);
    }

    protected function jsonError(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        $body = ['success' => false, 'message' => $message];
        if ($errors !== []) {
            $body['errors'] = $errors;
        }

        return response()->json($body, $status);
    }

    protected function jsonList(iterable $items, int $total, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $items,
            'total' => $total,
        ], $status);
    }
}
