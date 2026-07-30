<?php

use App\Http\Controllers\Api\AprovacaoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\SetorController;
use App\Http\Controllers\Api\SistemaController;
use Illuminate\Support\Facades\Route;

// Público
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/autocadastro', [AuthController::class, 'autocadastro'])->middleware('throttle:5,1');

// Autenticado (JWT)
Route::middleware('jwt.auth')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/setores', [SetorController::class, 'index']);
    Route::get('/sistemas/visiveis', [SistemaController::class, 'visiveis']);

    // Gestor de setor ou admin
    Route::middleware('role:gestor,admin')->group(function () {
        Route::get('/funcionarios', [FuncionarioController::class, 'index']);
        Route::get('/aprovacoes', [AprovacaoController::class, 'index']);
        Route::post('/aprovacoes/{funcionario}/aprovar', [AprovacaoController::class, 'aprovar']);
        Route::post('/aprovacoes/{funcionario}/recusar', [AprovacaoController::class, 'recusar']);
    });

    // Admin (TI)
    Route::middleware('role:admin')->group(function () {
        Route::post('/setores', [SetorController::class, 'store']);

        Route::get('/sistemas', [SistemaController::class, 'index']);
        Route::post('/sistemas', [SistemaController::class, 'store']);
        Route::patch('/sistemas/{sistema}/toggle-ativo', [SistemaController::class, 'toggleAtivo']);

        Route::post('/funcionarios/{funcionario}/promover', [FuncionarioController::class, 'promover']);
        Route::post('/funcionarios/{funcionario}/rebaixar', [FuncionarioController::class, 'rebaixar']);
    });
});
