<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use App\Services\JwtService;
use App\Support\AccessScope;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use ApiResponse;

    // POST /api/auth/login
    public function login(Request $request, JwtService $jwt): JsonResponse
    {
        $email = (string) $request->input('email', '');
        $senha = (string) $request->input('senha', '');

        if ($email === '' || $senha === '') {
            return $this->jsonError('E-mail e senha são obrigatórios.', 422);
        }

        $funcionario = Funcionario::where('email', $email)->where('status', 'ativo')->first();

        if (! $funcionario || ! Hash::check($senha, $funcionario->senha_hash)) {
            return $this->jsonError('Credenciais inválidas.', 401);
        }

        $emitido = $jwt->emitir($funcionario);

        return $this->jsonSuccess([
            'token' => $emitido['token'],
            'expira_em' => $emitido['expira_em'],
            'usuario' => $this->serializar($funcionario),
        ]);
    }

    // POST /api/auth/logout — JWT é stateless, só confirmação (padronização com o RondaSocial).
    public function logout(): JsonResponse
    {
        return $this->jsonSuccess(null, 'Logout realizado.');
    }

    // GET /api/auth/me
    public function me(Request $request): JsonResponse
    {
        $funcionario = $request->user();

        $sistemas = AccessScope::sistemasVisiveis($funcionario)->get();

        return $this->jsonSuccess([
            'usuario' => $this->serializar($funcionario),
            'sistemas' => $sistemas,
        ]);
    }

    // POST /api/autocadastro — público. Cria funcionário pendente, sem acesso a sistema nenhum até aprovação.
    public function autocadastro(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:funcionarios,email'],
            'senha' => ['required', 'string', 'min:6'],
            'setor_id' => ['required', 'integer', 'exists:setores,id'],
        ], [
            'nome.required' => 'Informe o nome.',
            'email.required' => 'Informe o e-mail.',
            'email.email' => 'E-mail inválido.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'senha.required' => 'Informe a senha.',
            'senha.min' => 'A senha deve ter pelo menos 6 caracteres.',
            'setor_id.required' => 'Selecione um setor.',
            'setor_id.exists' => 'Setor inválido.',
        ]);

        if ($validator->fails()) {
            return $this->jsonError('Dados inválidos.', 422, $validator->errors()->toArray());
        }

        $dados = $validator->validated();

        $funcionario = Funcionario::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'senha_hash' => Hash::make($dados['senha']),
            'iniciais' => Funcionario::gerarIniciais($dados['nome']),
            'setor_id' => $dados['setor_id'],
            'papel' => 'funcionario',
            'status' => 'pendente',
        ]);

        return $this->jsonSuccess($this->serializar($funcionario), 'Cadastro enviado para aprovação.', 201);
    }

    private function serializar(Funcionario $funcionario): array
    {
        return [
            'id' => $funcionario->id,
            'nome' => $funcionario->nome,
            'email' => $funcionario->email,
            'iniciais' => $funcionario->iniciais,
            'papel' => $funcionario->papel,
            'setor_id' => $funcionario->setor_id,
            'setor_gestao_id' => $funcionario->setor_gestao_id,
            'status' => $funcionario->status,
        ];
    }
}
