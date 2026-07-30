<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sistema;
use App\Support\AccessScope;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SistemaController extends Controller
{
    use ApiResponse;

    // GET /api/sistemas — admin, catálogo completo (ativos e inativos, com setores vinculados)
    public function index(): JsonResponse
    {
        $sistemas = Sistema::with('setores:id,nome')->orderBy('nome')->get();

        return $this->jsonList($sistemas, $sistemas->count());
    }

    // GET /api/sistemas/visiveis — qualquer usuário autenticado, para a tela "Meus Sistemas"
    public function visiveis(Request $request): JsonResponse
    {
        $sistemas = AccessScope::sistemasVisiveis($request->user())->orderBy('nome')->get();

        return $this->jsonList($sistemas, $sistemas->count());
    }

    // POST /api/sistemas — admin
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => ['required', 'string', 'max:255', 'unique:sistemas,nome'],
            'descricao' => ['nullable', 'string', 'max:500'],
            'cor' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'global' => ['boolean'],
            'setores_ids' => ['array'],
            'setores_ids.*' => ['integer', 'exists:setores,id'],
        ], [
            'nome.required' => 'Informe o nome do sistema.',
            'nome.unique' => 'Já existe um sistema com esse nome.',
            'cor.regex' => 'Cor inválida — use o formato #RRGGBB.',
            'setores_ids.*.exists' => 'Um dos setores selecionados não existe.',
        ]);

        if ($validator->fails()) {
            return $this->jsonError('Dados inválidos.', 422, $validator->errors()->toArray());
        }

        $dados = $validator->validated();
        $global = (bool) ($dados['global'] ?? false);

        $sistema = DB::transaction(function () use ($dados, $global) {
            $sistema = Sistema::create([
                'slug' => Str::slug($dados['nome']),
                'nome' => $dados['nome'],
                'descricao' => $dados['descricao'] ?? null,
                'cor' => $dados['cor'] ?? '#334155',
                'global' => $global,
                'ativo' => true,
            ]);

            if (! $global) {
                $sistema->setores()->sync($dados['setores_ids'] ?? []);
            }

            return $sistema;
        });

        return $this->jsonSuccess($sistema->load('setores:id,nome'), 'Sistema criado.', 201);
    }

    // PATCH /api/sistemas/{sistema}/toggle-ativo — admin
    public function toggleAtivo(Sistema $sistema): JsonResponse
    {
        $sistema->update(['ativo' => ! $sistema->ativo]);

        return $this->jsonSuccess($sistema, 'Status atualizado.');
    }
}
