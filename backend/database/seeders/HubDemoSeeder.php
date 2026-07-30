<?php

namespace Database\Seeders;

use App\Models\Funcionario;
use App\Models\Setor;
use App\Models\Sistema;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

// Espelha 1:1 frontend/src/mocks/data.js — mesmos ids, papéis e senha de teste,
// para facilitar conferência cruzada entre o mock do frontend e esta API.
class HubDemoSeeder extends Seeder
{
    private const SENHA_MOCK = '123456';

    public function run(): void
    {
        $setores = $this->criarSetores();
        $this->criarSistemas($setores);
        $this->criarFuncionarios($setores);
        $this->criarFila($setores);
    }

    private function criarSetores(): array
    {
        $nomes = ['Social', 'Recepção', 'Administrativo', 'TI'];

        $setores = [];
        foreach ($nomes as $nome) {
            $setores[] = Setor::create(['nome' => $nome]);
        }

        // índice 0 => Social (id 1), 1 => Recepção (id 2), 2 => Administrativo (id 3), 3 => TI (id 4)
        return $setores;
    }

    private function criarSistemas(array $setores): void
    {
        [$social, $recepcao] = $setores;

        $rondaSocial = Sistema::create([
            'slug' => 'ronda-social',
            'nome' => 'Ronda Social',
            'descricao' => 'Registro e acompanhamento de atendimentos sociais em campo.',
            'cor' => '#1e3a5f',
            'global' => false,
            'ativo' => true,
        ]);
        $rondaSocial->setores()->sync([$social->id]);

        $visitaSegura = Sistema::create([
            'slug' => 'visita-segura',
            'nome' => 'Visita Segura',
            'descricao' => 'Controle de visitas e triagem na recepção.',
            'cor' => '#0e7490',
            'global' => false,
            'ativo' => true,
        ]);
        $visitaSegura->setores()->sync([$recepcao->id]);

        Sistema::create([
            'slug' => 'escala',
            'nome' => 'Escala',
            'descricao' => 'Gestão de escalas e plantões de toda a equipe.',
            'cor' => '#7c3aed',
            'global' => true,
            'ativo' => true,
        ]);

        Sistema::create([
            'slug' => 'permuta',
            'nome' => 'Permuta',
            'descricao' => 'Solicitação e aprovação de trocas de turno entre servidores.',
            'cor' => '#b45309',
            'global' => true,
            'ativo' => false,
        ]);
    }

    private function criarFuncionarios(array $setores): void
    {
        [$social, $recepcao, $administrativo, $ti] = $setores;
        $senha = Hash::make(self::SENHA_MOCK);

        // iniciais copiadas literalmente do mock (primeira+última letra do nome, como no frontend) —
        // Funcionario::gerarIniciais() usa "duas primeiras palavras" e é só para autocadastro em runtime.
        $funcionarios = [
            ['nome' => 'Ana Beatriz Lima', 'email' => 'ana.lima@exemplo.local', 'iniciais' => 'AL', 'setor' => $social, 'papel' => 'funcionario'],
            ['nome' => 'Carlos Eduardo Rocha', 'email' => 'carlos.rocha@exemplo.local', 'iniciais' => 'CR', 'setor' => $social, 'papel' => 'gestor'],
            ['nome' => 'Fernanda Souza Melo', 'email' => 'fernanda.melo@exemplo.local', 'iniciais' => 'FM', 'setor' => $recepcao, 'papel' => 'funcionario'],
            ['nome' => 'Marcos Paulo Andrade', 'email' => 'marcos.andrade@exemplo.local', 'iniciais' => 'MA', 'setor' => $recepcao, 'papel' => 'gestor'],
            ['nome' => 'Juliana Prado Ferreira', 'email' => 'juliana.prado@exemplo.local', 'iniciais' => 'JF', 'setor' => $ti, 'papel' => 'admin'],
            ['nome' => 'Ricardo Nunes Barbosa', 'email' => 'ricardo.barbosa@exemplo.local', 'iniciais' => 'RB', 'setor' => $administrativo, 'papel' => 'funcionario'],
            ['nome' => 'Patrícia Gomes Ribeiro', 'email' => 'patricia.ribeiro@exemplo.local', 'iniciais' => 'PR', 'setor' => $administrativo, 'papel' => 'gestor'],
        ];

        foreach ($funcionarios as $dados) {
            Funcionario::create([
                'nome' => $dados['nome'],
                'email' => $dados['email'],
                'senha_hash' => $senha,
                'iniciais' => $dados['iniciais'],
                'setor_id' => $dados['setor']->id,
                'papel' => $dados['papel'],
                'setor_gestao_id' => $dados['papel'] === 'gestor' ? $dados['setor']->id : null,
                'status' => 'ativo',
            ]);
        }
    }

    private function criarFila(array $setores): void
    {
        [$social, $recepcao, $administrativo] = $setores;
        $senha = Hash::make(self::SENHA_MOCK);

        $pendentes = [
            ['nome' => 'Bruno Almeida Cardoso', 'email' => 'bruno.cardoso@exemplo.local', 'setor' => $recepcao, 'criadoEm' => '2026-07-25'],
            ['nome' => 'Camila Duarte Santos', 'email' => 'camila.santos@exemplo.local', 'setor' => $social, 'criadoEm' => '2026-07-26'],
            ['nome' => 'Diego Farias Teixeira', 'email' => 'diego.teixeira@exemplo.local', 'setor' => $administrativo, 'criadoEm' => '2026-07-24'],
        ];

        foreach ($pendentes as $dados) {
            Funcionario::create([
                'nome' => $dados['nome'],
                'email' => $dados['email'],
                'senha_hash' => $senha,
                'iniciais' => Funcionario::gerarIniciais($dados['nome']),
                'setor_id' => $dados['setor']->id,
                'papel' => 'funcionario',
                'setor_gestao_id' => null,
                'status' => 'pendente',
                'created_at' => $dados['criadoEm'],
                'updated_at' => $dados['criadoEm'],
            ]);
        }
    }
}
