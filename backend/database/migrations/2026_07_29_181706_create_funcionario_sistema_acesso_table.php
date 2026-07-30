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
        // Reservada para concessões de acesso explícitas fora da regra padrão de
        // setor/global (decisão 8 do desenho: acesso extra continua centralizado no admin).
        // Sem endpoint dedicado ainda — nenhuma tela do frontend consome isso hoje.
        Schema::create('funcionario_sistema_acesso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('funcionario_id')->constrained('funcionarios')->cascadeOnDelete();
            $table->foreignId('sistema_id')->constrained('sistemas')->cascadeOnDelete();
            $table->string('papel')->nullable();
            $table->foreignId('setor_escopo_id')->nullable()->constrained('setores')->nullOnDelete();
            $table->timestamps();

            $table->unique(['funcionario_id', 'sistema_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funcionario_sistema_acesso');
    }
};
