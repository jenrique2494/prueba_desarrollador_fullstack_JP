<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentSession;
use App\Models\Cliente;
use App\Models\Wallet;
use App\Http\Requests\StorePagoRequest;
use App\Mail\PagoTokenMail;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PagoController extends Controller
{
    use ApiResponseTrait;

    /**
     * Iniciar pago - Crear sesión de pago y generar token
     */
    public function store(StorePagoRequest $request)
    {
        try {
            // Buscar cliente
            $cliente = Cliente::where('documento', $request->documento)
                ->where('celular', $request->celular)
                ->first();

            if (!$cliente) {
                return $this->errorResponse('Cliente no encontrado o datos inconsistentes', 404);
            }

            // Verificar saldo
            $wallet = $cliente->wallet;
            if (!$wallet || $wallet->balance < $request->monto) {
                return $this->errorResponse('Saldo insuficiente para realizar esta operación', 400);
            }

            // Generar token de 6 dígitos
            $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $sessionId = Str::uuid()->toString();

            // Crear sesión de pago
            $sesionPago = PaymentSession::create([
                'cliente_id' => $cliente->id,
                'session_id' => $sessionId,
                'documento' => $request->documento,
                'token' => $token,
                'monto' => $request->monto,
                'estado' => 'pending',
                'expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Enviar token por email
            try {
                Mail::to($cliente->email)->send(new PagoTokenMail($cliente, $sesionPago));
            } catch (\Exception $emailError) {
                \Log::warning('Error al enviar email de token: ' . $emailError->getMessage());
            }

            $responseData = [
                'session_id' => $sessionId,
                'cliente_id' => $cliente->id,
                'monto' => $request->monto,
                'estado' => 'pending',
                'email_enviado' => $cliente->email,
                'mensaje_email' => 'Token de confirmación enviado al email ' . $cliente->email,
                'expira_en_minutos' => 10,
            ];

            // En desarrollo, incluir el token en la respuesta para facilitar pruebas
            if (env('APP_DEBUG', false)) {
                $responseData['token_debug'] = $token;
            }

            return $this->createdResponse(
                $responseData,
                'Sesión de pago creada. Revisa tu email para obtener el token de confirmación'
            );
        } catch (\Exception $e) {
            \Log::error('Error en PagoController@store: ' . $e->getMessage());
            return $this->errorResponse(
                'Error al crear la sesión de pago: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Confirmar pago con token
     */
    public function confirmar(Request $request)
    {
        try {
            $validated = $request->validate([
                'session_id' => 'required|string',
                'token' => 'required|string',
            ], [
                'session_id.required' => 'El ID de sesión es requerido',
                'token.required' => 'El token es requerido',
            ]);

            // Buscar sesión de pago
            $sesionPago = PaymentSession::where('session_id', $validated['session_id'])->first();

            if (!$sesionPago) {
                return $this->errorResponse('Sesión de pago no encontrada', 404);
            }

            // Validar expiración
            if (Carbon::now()->isAfter($sesionPago->expires_at)) {
                $sesionPago->update(['estado' => 'expirada']);
                return $this->errorResponse('La sesión ha expirado', 400);
            }

            // Validar token
            if ($sesionPago->token !== $validated['token']) {
                return $this->errorResponse('Token incorrecto', 400);
            }

            // Validar estado
            if ($sesionPago->estado !== 'pending') {
                return $this->errorResponse('La sesión ya fue procesada', 400);
            }

            // Obtener billetera
            $wallet = $sesionPago->cliente->wallet;

            // Descontar monto
            $wallet->balance -= $sesionPago->monto;
            $wallet->save();

            // Actualizar estado de sesión
            $sesionPago->update([
                'estado' => 'confirmed',
                'confirmed_at' => Carbon::now()
            ]);

            return $this->successResponse(
                [
                    'session_id' => $sesionPago->session_id,
                    'cliente_id' => $sesionPago->cliente_id,
                    'monto' => $sesionPago->monto,
                    'balance_actual' => $wallet->balance,
                    'estado' => 'confirmed',
                ],
                'Pago confirmado exitosamente'
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
     * GET /api/pagos/token/{session_id}
     */
    public function getToken($sessionId)
    {
        if (!env('APP_DEBUG', false)) {
            return $this->errorResponse('Este endpoint solo está disponible en modo desarrollo', 403);
        }

        try {
            $sesionPago = PaymentSession::where('session_id', $sessionId)->first();

            if (!$sesionPago) {
                return $this->errorResponse('Sesión de pago no encontrada', 404);
            }

            return $this->successResponse(
                [
                    'session_id' => $sesionPago->session_id,
                    'token' => $sesionPago->token,
                    'cliente_id' => $sesionPago->cliente_id,
                    'monto' => $sesionPago->monto,
                    'estado' => $sesionPago->estado,
                    'expires_at' => $sesionPago->expires_at,
                ],
                'Token obtenido del servidor (DESARROLLO SOLAMENTE)'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener el token: ' . $e->getMessage(), 500);
        }
    }
}
