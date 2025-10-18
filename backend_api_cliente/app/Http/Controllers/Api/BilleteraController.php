<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecargaBilleteraRequest;
use App\Services\ApiDbService;
use App\Traits\ApiResponseTrait;

class BilleteraController extends Controller
{
    use ApiResponseTrait;

    protected ApiDbService $apiDbService;

    public function __construct(ApiDbService $apiDbService)
    {
        $this->apiDbService = $apiDbService;
    }

    /**
     * Recargar billetera - Consumidor de API Backend DB
     */
    public function recargarBilletera(RecargaBilleteraRequest $request)
    {
        try {
            // Consumir API de backend_api_db
            $response = $this->apiDbService->recargarBilletera($request->validated());

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->successResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Billetera recargada exitosamente'
                );
            }

            // Manejar errores de validación u otros
            $statusCode = $response->status();
            $responseData = $response->json();

            // Determinar mensaje: si viene en 'message', usarlo; si no, usar valor por defecto
            $message = $responseData['message'] ?? 'Error al recargar la billetera';
            $errors = $responseData['errors'] ?? null;

            return $this->errorResponse(
                $message,
                $statusCode,
                $errors
            );
        } catch (\Exception $e) {
            \Log::error('Error en BilleteraController@recargarBilletera: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al recargar la billetera: ' . $e->getMessage(),
                500
            );
        }
    }
}
