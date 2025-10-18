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

    /**
     * Consultar saldo - Consumidor de API Backend DB
     * Recibe query params: documento y celular
     */
    public function consultarSaldo(\Illuminate\Http\Request $request)
    {
        try {
            // Validar parámetros GET
            $validated = $request->validate([
                'documento' => 'required|string|min:1',
                'celular' => 'required|string|min:1',
            ]);

            // Consumir API de backend_api_db
            $response = $this->apiDbService->consultarSaldo($validated);

            if ($response->successful()) {
                $responseData = $response->json();
                return $this->successResponse(
                    $responseData['data'] ?? null,
                    $responseData['message'] ?? 'Saldo consultado exitosamente'
                );
            }

            // Manejar errores
            $statusCode = $response->status();
            $responseData = $response->json();

            $message = $responseData['message'] ?? 'Error al consultar el saldo';
            $errors = $responseData['errors'] ?? null;

            return $this->errorResponse(
                $message,
                $statusCode,
                $errors
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse(
                'Error de validación: ' . implode(', ', $e->errors()['documento'] ?? []) . ' ' . implode(', ', $e->errors()['celular'] ?? []),
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            \Log::error('Error en BilleteraController@consultarSaldo: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al consultar el saldo: ' . $e->getMessage(),
                500
            );
        }
    }
}
