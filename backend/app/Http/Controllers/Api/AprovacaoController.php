<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use App\Support\AccessScope;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AprovacaoController extends Controller
{
    use ApiResponse;

    // GET /api/aprovacoes — gestor (só o próprio setor) ou admin (fallback, todas)
    public function index(Request $request): JsonResponse
    {
        $fila = AccessScope::filaVisivel($request->user())
            ->with('setor:id,nome')
            ->orderBy('created_at')
            ->get();

        return $this->jsonList($fila, $fila->count());
    }

    // POST /api/aprovacoes/{funcionario}/aprovar
    public function aprovar(Request $request, Funcionario $funcionario): JsonResponse
    {
        if ($erro = $this->garantirNaFila($request, $funcionario)) {
            return $erro;
        }

        $funcionario->update(['status' => 'ativo']);

        return $this->jsonSuccess($funcionario->fresh(), 'Cadastro aprovado.');
    }

    // POST /api/aprovacoes/{funcionario}/recusar
    public function recusar(Request $request, Funcionario $funcionario): JsonResponse
    {
        if ($erro = $this->garantirNaFila($request, $funcionario)) {
            return $erro;
        }

        $funcionario->delete();

        return $this->jsonSuccess(null, 'Cadastro recusado.');
    }

    private function garantirNaFila(Request $request, Funcionario $funcionario): ?JsonResponse
    {
        $visivel = AccessScope::filaVisivel($request->user())->whereKey($funcionario->id)->exists();

        if (! $visivel) {
            return $this->jsonError('Cadastro não encontrado na fila de aprovação.', 404);
        }

        return null;
    }
}
