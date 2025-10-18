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
                return $this->createdResponse(
                    $response->json('data'),
                    $response->json('message')
                );
            }

            return $this->errorResponse(
                $response->json('message'),
                $response->status(),
                $response->json('errors')
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al registrar el cliente: ' . $e->getMessage(),
                500
            );
        }
    }
}
