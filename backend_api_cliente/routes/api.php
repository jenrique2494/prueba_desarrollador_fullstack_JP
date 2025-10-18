<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClienteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Backend API Cliente - Puente entre cliente y Backend API DB
|
*/

// Registro Cliente
Route::prefix('clientes')->group(function () {
    Route::post('registro', [ClienteController::class, 'registroCliente'])->name('clientes.registro');
});
