<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('senha_hash');
            $table->string('iniciais', 4);
            $table->foreignId('setor_id')->constrained('setores');
            $table->enum('papel', ['funcionario', 'gestor', 'admin'])->default('funcionario');
            // Preenchido só quando papel = gestor (escopo de exatamente 1 setor).
            $table->foreignId('setor_gestao_id')->nullable()->constrained('setores')->nullOnDelete();
            // pendente = autocadastro aguardando aprovação, sem acesso a sistema nenhum ainda.
            $table->enum('status', ['pendente', 'ativo', 'inativo'])->default('ativo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};
