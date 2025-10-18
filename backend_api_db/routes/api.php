<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClienteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rutas mínimas para esta etapa: solo registro de cliente.
|
*/

// Registro Cliente
Route::prefix('clientes')->group(function () {
    Route::post('registro', [ClienteController::class, 'registroCliente'])->name('clientes.registro');
});
