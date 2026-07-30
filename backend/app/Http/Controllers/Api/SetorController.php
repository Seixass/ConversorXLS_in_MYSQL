<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setor;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SetorController extends Controller
{
    use ApiResponse;

    // GET /api/setores — qualquer usuário autenticado
    public function index(): JsonResponse
    {
        // Contagem exclui pendentes de aprovação (eles ainda não são "funcionários do setor").
        $setores = Setor::withCount(['funcionarios' => fn ($q) => $q->where('status', '!=', 'pendente')])
            ->orderBy('nome')
            ->get();

        return $this->jsonList($setores, $setores->count());
    }

    // POST /api/setores — admin
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => ['required', 'string', 'max:255', 'unique:setores,nome'],
        ], [
            'nome.required' => 'Informe o nome do setor.',
            'nome.unique' => 'Já existe um setor com esse nome.',
        ]);

        if ($validator->fails()) {
            return $this->jsonError('Dados inválidos.', 422, $validator->errors()->toArray());
        }

        $setor = Setor::create($validator->validated());

        return $this->jsonSuccess($setor, 'Setor criado.', 201);
    }
}
