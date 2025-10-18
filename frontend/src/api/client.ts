import axios, { AxiosInstance } from 'axios';

export interface Cliente {
  id?: number;
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}

export interface RecargaBilletera {
  documento: string;
  celular: string;
  valor: number;
}

export interface Saldo {
  cliente_id: number;
  documento: string;
  nombres: string;
  email: string;
  celular: string;
  balance: number;
  saldo_disponible: number;
}

export interface PagoInicio {
  documento: string;
  celular: string;
  monto: number;
}

export interface PagoConfirmacion {
  session_id: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Clientes
  registroCliente(data: Cliente): Promise<ApiResponse<Cliente>> {
    return this.instance.post('/clientes/registro', data);
  }

  // Billetera
  recargarBilletera(data: RecargaBilletera): Promise<ApiResponse<Saldo>> {
    return this.instance.post('/billetera/recargar', data);
  }

  consultarSaldo(documento: string, celular: string): Promise<ApiResponse<Saldo>> {
    return this.instance.get('/billetera/saldo', {
      params: { documento, celular },
    });
  }

  // Pagos
  iniciarPago(data: PagoInicio): Promise<ApiResponse<any>> {
    return this.instance.post('/pagos/iniciar', data);
  }

  confirmarPago(data: PagoConfirmacion): Promise<ApiResponse<any>> {
    return this.instance.post('/pagos/confirmar', data);
  }

  obtenerToken(sessionId: string): Promise<ApiResponse<any>> {
    return this.instance.get(`/pagos/token/${sessionId}`);
  }
}

export const apiClient = new ApiClient();
