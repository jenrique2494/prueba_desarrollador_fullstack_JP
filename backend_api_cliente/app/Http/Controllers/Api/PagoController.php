<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePagoRequest;
use App\Http\Requests\ConfirmarPagoRequest;
use App\Services\ApiDbService;
use App\Traits\ApiResponseTrait;

class PagoController extends Controller
{
    use ApiResponseTrait;

    protected ApiDbService $apiDbService;

    public function __construct(ApiDbService $apiDbService)
    {
        $this->apiDbService = $apiDbService;
    }

    /**
     * Iniciar pago - Consumidor de API Backend DB
     */
    public function store(StorePagoRequest $request)
    {
        try {
            // Consumir API de backend_api_db
            $response = $this->apiDbService->iniciarPago($request->validated());

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->createdResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Sesión de pago creada'
                );
            }

            // Manejar errores
            $statusCode = $response->status();
            $responseData = $response->json();

            $message = $responseData['message'] ?? 'Error al iniciar el pago';
            $errors = $responseData['errors'] ?? null;

            return $this->errorResponse(
                $message,
                $statusCode,
                $errors
            );
        } catch (\Exception $e) {
            \Log::error('Error en PagoController@store: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al iniciar el pago: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Confirmar pago - Consumidor de API Backend DB
     */
    public function confirmar(ConfirmarPagoRequest $request)
    {
        try {
            // Consumir API de backend_api_db
            $response = $this->apiDbService->confirmarPago($request->validated());

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->successResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Pago confirmado exitosamente'
                );
            }

            // Manejar errores
            $statusCode = $response->status();
            $responseData = $response->json();

            $message = $responseData['message'] ?? 'Error al confirmar el pago';
            $errors = $responseData['errors'] ?? null;

            return $this->errorResponse(
                $message,
                $statusCode,
                $errors
            );
        } catch (\Exception $e) {
            \Log::error('Error en PagoController@confirmar: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al confirmar el pago: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Obtener token de sesión de pago (SOLO PARA DESARROLLO)
     */
    public function getToken($sessionId)
    {
        try {
            // Consumir endpoint de backend_api_db
            $response = $this->apiDbService->getPaymentToken($sessionId);

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->successResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Token obtenido'
                );
            }

            $statusCode = $response->status();
            $responseData = $response->json();

            return $this->errorResponse(
                $responseData['message'] ?? 'Error al obtener el token',
                $statusCode
            );
        } catch (\Exception $e) {
            \Log::error('Error en PagoController@getToken: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al obtener el token: ' . $e->getMessage(),
                500
            );
        }
    }
}
