<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Setor extends Model
{
    // Pluralização automática do Eloquent não entende português ("setor" -> "setors").
    protected $table = 'setores';

    protected $fillable = ['nome'];

    public function funcionarios(): HasMany
    {
        return $this->hasMany(Funcionario::class);
    }

    public function sistemas(): BelongsToMany
    {
        return $this->belongsToMany(Sistema::class, 'sistema_setor');
    }
}
