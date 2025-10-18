<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistroClienteRequest;
use App\Services\ApiDbService;
use App\Traits\ApiResponseTrait;

class ClienteController extends Controller
{
    use ApiResponseTrait;

    protected ApiDbService $apiDbService;

    public function __construct(ApiDbService $apiDbService)
    {
        $this->apiDbService = $apiDbService;
    }

    /**
     * Registrar cliente - Consumidor de API Backend DB
     */
    public function registroCliente(RegistroClienteRequest $request)
    {
        try {
            // Consumir API de backend_api_db
            $response = $this->apiDbService->registroCliente($request->validated());

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->createdResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Cliente registrado exitosamente'
                );
            }

            // Manejar errores de validación u otros
            $statusCode = $response->status();
            $responseData = $response->json();

            // Determinar mensaje: si viene en 'message', usarlo; si no, usar estructura de validación
            $message = $responseData['message'] ?? 'Error al registrar cliente';
            $errors = $responseData['errors'] ?? null;

            return $this->errorResponse(
                $message,
                $statusCode,
                $errors
            );
        } catch (\Exception $e) {
            \Log::error('Error en ClienteController@registroCliente: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al registrar el cliente: ' . $e->getMessage(),
                500
            );
        }
    }
}
