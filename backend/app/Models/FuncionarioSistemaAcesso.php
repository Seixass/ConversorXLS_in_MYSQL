<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuncionarioSistemaAcesso extends Model
{
    protected $table = 'funcionario_sistema_acesso';

    protected $fillable = ['funcionario_id', 'sistema_id', 'papel', 'setor_escopo_id'];

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class);
    }

    public function sistema(): BelongsTo
    {
        return $this->belongsTo(Sistema::class);
    }

    public function setorEscopo(): BelongsTo
    {
        return $this->belongsTo(Setor::class, 'setor_escopo_id');
    }
}
