// Cliente
export interface Cliente {
  id: number;
  documento: string;
  nombres: string;
  email: string;
  celular: string;
  balance?: number;
}

// Billetera
export interface Billetera {
  cliente_id: number;
  documento: string;
  nombres: string;
  email: string;
  celular: string;
  balance: number;
  saldo_disponible: number;
}

// Pago
export interface Pago {
  session_id: string;
  cliente_id: number;
  monto: number;
  token_debug?: string;
}

// Respuesta API
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Estados de la aplicación
export type TabType = 'registro' | 'recargar' | 'pagar' | 'confirmar' | 'saldo';
