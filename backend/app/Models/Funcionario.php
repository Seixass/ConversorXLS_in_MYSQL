<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Funcionario extends Model
{
    protected $table = 'funcionarios';

    protected $fillable = [
        'nome', 'email', 'senha_hash', 'iniciais',
        'setor_id', 'papel', 'setor_gestao_id', 'status',
    ];

    protected $hidden = ['senha_hash'];

    public function setor(): BelongsTo
    {
        return $this->belongsTo(Setor::class);
    }

    public function setorGestao(): BelongsTo
    {
        return $this->belongsTo(Setor::class, 'setor_gestao_id');
    }

    public function acessosExtras(): HasMany
    {
        return $this->hasMany(FuncionarioSistemaAcesso::class);
    }

    public function isGestor(): bool
    {
        return $this->papel === 'gestor';
    }

    public function isAdmin(): bool
    {
        return $this->papel === 'admin';
    }

    public function isGestorOuAdmin(): bool
    {
        return $this->isGestor() || $this->isAdmin();
    }

    // Duas primeiras iniciais do nome, maiúsculas — usado no autocadastro e no seeder.
    public static function gerarIniciais(string $nome): string
    {
        $partes = array_filter(explode(' ', trim($nome)));

        return mb_strtoupper(implode('', array_map(
            fn (string $parte) => mb_substr($parte, 0, 1),
            array_slice($partes, 0, 2)
        )));
    }
}
