<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\BilleteraController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Backend API DB - Acceso directo a base de datos
|
*/

// Registro Cliente
Route::prefix('clientes')->group(function () {
    Route::post('registro', [ClienteController::class, 'registroCliente'])->name('clientes.registro');
});

// Recarga Billetera
Route::prefix('billetera')->group(function () {
    Route::post('recargar', [BilleteraController::class, 'recargarBilletera'])->name('billetera.recargar');
});
