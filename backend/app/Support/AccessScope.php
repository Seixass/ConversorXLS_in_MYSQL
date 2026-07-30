<?php

namespace App\Support;

use App\Models\Funcionario;
use App\Models\Sistema;
use Illuminate\Database\Eloquent\Builder;

// Regras de escopo do Hub, centralizadas para não duplicar em cada controller —
// espelha 1:1 a lógica de frontend/src/utils/permissoes.js.
class AccessScope
{
    public static function sistemasVisiveis(Funcionario $usuario): Builder
    {
        return Sistema::query()->visivelParaSetor($usuario->setor_id);
    }

    // Admin vê todos, gestor só o próprio setor, funcionário não vê a lista.
    // Pendentes de aprovação ficam fora daqui — eles só aparecem em filaVisivel().
    public static function funcionariosVisiveis(Funcionario $usuario): Builder
    {
        $base = Funcionario::query()->where('status', '!=', 'pendente');

        if ($usuario->isAdmin()) {
            return $base;
        }

        if ($usuario->isGestor()) {
            return $base->where('setor_id', $usuario->setor_gestao_id);
        }

        return Funcionario::query()->whereRaw('1 = 0');
    }

    // Fila de aprovação: admin vê todas (fallback), gestor só do próprio setor.
    public static function filaVisivel(Funcionario $usuario): Builder
    {
        $base = Funcionario::query()->where('status', 'pendente');

        if ($usuario->isAdmin()) {
            return $base;
        }

        if ($usuario->isGestor()) {
            return $base->where('setor_id', $usuario->setor_gestao_id);
        }

        return Funcionario::query()->whereRaw('1 = 0');
    }
}
