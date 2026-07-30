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
        // Pivot N:N — hoje sempre 1 setor por sistema exclusivo, mas modelado como N:N
        // (decisão registrada: flexibilidade futura sem precisar migrar o schema de novo).
        Schema::create('sistema_setor', function (Blueprint $table) {
            $table->foreignId('sistema_id')->constrained('sistemas')->cascadeOnDelete();
            $table->foreignId('setor_id')->constrained('setores')->cascadeOnDelete();
            $table->primary(['sistema_id', 'setor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sistema_setor');
    }
};
