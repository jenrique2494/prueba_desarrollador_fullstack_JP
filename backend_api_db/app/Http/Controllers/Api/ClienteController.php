<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Wallet;
use App\Http\Requests\StoreClienteRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    use ApiResponseTrait;

    /**
     * Registrar cliente
     */
    public function registroCliente(StoreClienteRequest $request)
    {
        try {
            $cliente = Cliente::create($request->validated());

            // Crear wallet asociada
            Wallet::create([
                'cliente_id' => $cliente->id,
                'balance' => 0,
            ]);

            $cliente->load('wallet');

            return $this->createdResponse($cliente, 'Cliente registrado exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al registrar el cliente: ' . $e->getMessage(), 500);
        }
    }
}
