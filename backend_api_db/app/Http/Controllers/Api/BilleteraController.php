<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\Cliente;
use App\Http\Requests\RecargaBilleteraRequest;
use App\Http\Requests\ConsultarSaldoRequest;
use App\Traits\ApiResponseTrait;

class BilleteraController extends Controller
{
    use ApiResponseTrait;

    /**
     * Recargar billetera del cliente
     */
    public function recargarBilletera(RecargaBilleteraRequest $request)
    {
        try {
            // Buscar cliente por documento y celular
            $cliente = Cliente::where('documento', $request->documento)
                ->where('celular', $request->celular)
                ->first();

            if (!$cliente) {
                return $this->errorResponse(
                    'El documento y celular no coinciden con ningún cliente registrado',
                    404
                );
            }

            // Obtener o crear billetera
            $billetera = $cliente->wallet;
            if (!$billetera) {
                $billetera = Wallet::create([
                    'cliente_id' => $cliente->id,
                    'balance' => 0,
                ]);
            }

            // Recargar billetera
            $balanceAnterior = $billetera->balance;
            $nuevoBalance = $billetera->balance + $request->valor;
            $billetera->update(['balance' => $nuevoBalance]);

            return $this->successResponse(
                [
                    'cliente_id' => $cliente->id,
                    'documento' => $cliente->documento,
                    'nombres' => $cliente->nombres,
                    'valor_cargado' => (float) $request->valor,
                    'balance_anterior' => (float) $balanceAnterior,
                    'balance_actual' => (float) $billetera->balance,
                ],
                'Billetera recargada exitosamente'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Error al recargar la billetera: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Consultar saldo de la billetera
     */
    public function consultarSaldo(ConsultarSaldoRequest $request)
    {
        try {
            // Buscar cliente por documento y celular
            $cliente = Cliente::where('documento', $request->documento)
                ->where('celular', $request->celular)
                ->first();

            if (!$cliente) {
                return $this->errorResponse(
                    'El documento y celular no coinciden con ningún cliente registrado',
                    404
                );
            }

            // Obtener billetera
            $billetera = $cliente->wallet;

            if (!$billetera) {
                // Si no existe billetera, crear una con saldo 0
                $billetera = Wallet::create([
                    'cliente_id' => $cliente->id,
                    'balance' => 0,
                ]);
            }

            return $this->successResponse(
                [
                    'cliente_id' => $cliente->id,
                    'documento' => $cliente->documento,
                    'nombres' => $cliente->nombres,
                    'email' => $cliente->email,
                    'celular' => $cliente->celular,
                    'balance' => $billetera->balance,
                    'saldo_disponible' => $billetera->balance,
                ],
                'Saldo consultado exitosamente'
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
