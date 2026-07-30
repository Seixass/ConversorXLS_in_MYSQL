<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sistema extends Model
{
    protected $table = 'sistemas';

    protected $fillable = ['slug', 'nome', 'descricao', 'cor', 'global', 'ativo'];

    protected $casts = [
        'global' => 'boolean',
        'ativo' => 'boolean',
    ];

    public function setores(): BelongsToMany
    {
        return $this->belongsToMany(Setor::class, 'sistema_setor');
    }

    // Sistemas ativos e (globais OU do setor informado) — equivalente a sistemasVisiveis() do frontend.
    public function scopeVisivelParaSetor($query, int $setorId)
    {
        return $query->where('ativo', true)
            ->where(function ($q) use ($setorId) {
                $q->where('global', true)
                    ->orWhereHas('setores', fn ($s) => $s->where('setores.id', $setorId));
            });
    }
}
