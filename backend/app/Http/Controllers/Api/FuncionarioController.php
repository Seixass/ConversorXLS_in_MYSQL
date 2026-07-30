<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use App\Support\AccessScope;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FuncionarioController extends Controller
{
    use ApiResponse;

    // GET /api/funcionarios — gestor (só o próprio setor) ou admin (todos)
    public function index(Request $request): JsonResponse
    {
        $funcionarios = AccessScope::funcionariosVisiveis($request->user())
            ->with('setor:id,nome')
            ->orderBy('nome')
            ->get();

        return $this->jsonList($funcionarios, $funcionarios->count());
    }

    // POST /api/funcionarios/{funcionario}/promover — admin.
    // Escopo de gestor é de exatamente 1 setor: rebaixa o gestor anterior do mesmo setor.
    public function promover(Funcionario $funcionario): JsonResponse
    {
        if ($funcionario->status !== 'ativo') {
            return $this->jsonError('Só é possível promover um funcionário ativo.', 422);
        }

        DB::transaction(function () use ($funcionario) {
            Funcionario::where('papel', 'gestor')
                ->where('setor_gestao_id', $funcionario->setor_id)
                ->where('id', '!=', $funcionario->id)
                ->update(['papel' => 'funcionario', 'setor_gestao_id' => null]);

            $funcionario->update(['papel' => 'gestor', 'setor_gestao_id' => $funcionario->setor_id]);
        });

        return $this->jsonSuccess($funcionario->fresh(), 'Funcionário promovido a gestor.');
    }

    // POST /api/funcionarios/{funcionario}/rebaixar — admin
    public function rebaixar(Funcionario $funcionario): JsonResponse
    {
        $funcionario->update(['papel' => 'funcionario', 'setor_gestao_id' => null]);

        return $this->jsonSuccess($funcionario->fresh(), 'Funcionário rebaixado.');
    }
}
