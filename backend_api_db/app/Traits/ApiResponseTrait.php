<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * Retorna una respuesta exitosa
     */
    public function successResponse($data = null, string $message = 'Operación exitosa', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'code' => $code,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Retorna una respuesta de error
     */
    public function errorResponse(string $message = 'Error en la operación', int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code' => $code,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Retorna una respuesta de recurso creado
     */
    public function createdResponse($data, string $message = 'Recurso creado exitosamente'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Retorna una respuesta no encontrada
     */
    public function notFoundResponse(string $message = 'Recurso no encontrado'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Retorna una respuesta de validación fallida
     */
    public function validationErrorResponse($errors, string $message = 'Errores de validación'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }
}
