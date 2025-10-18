import axios, { AxiosInstance } from 'axios';
import { ApiResponse, Cliente, Billetera, Pago } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Registro Cliente
  async registroCliente(data: {
    documento: string;
    nombres: string;
    email: string;
    celular: string;
  }): Promise<ApiResponse<Cliente>> {
    return this.api.post('/clientes/registro', data);
  }

  // Recargar Billetera
  async recargarBilletera(data: {
    documento: string;
    celular: string;
    valor: number;
  }): Promise<ApiResponse<Billetera>> {
    return this.api.post('/billetera/recargar', data);
  }

  // Consultar Saldo
  async consultarSaldo(documento: string, celular: string): Promise<ApiResponse<Billetera>> {
    return this.api.get('/billetera/saldo', {
      params: { documento, celular },
    });
  }

  // Iniciar Pago
  async iniciarPago(data: {
    documento: string;
    celular: string;
    monto: number;
  }): Promise<ApiResponse<Pago>> {
    return this.api.post('/pagos/iniciar', data);
  }

  // Confirmar Pago
  async confirmarPago(data: {
    session_id: string;
    token: string;
  }): Promise<ApiResponse<{ confirmado: boolean; mensaje: string }>> {
    return this.api.post('/pagos/confirmar', data);
  }

  // Obtener Token (desarrollo)
  async getPaymentToken(sessionId: string): Promise<ApiResponse<Pago>> {
    return this.api.get(`/pagos/token/${sessionId}`);
  }
}

const apiService = new ApiService();

export default apiService;
