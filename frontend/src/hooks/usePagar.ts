import { useState } from 'react';
import { apiClient, PagoInicio } from '../api/client';
import { AxiosError } from 'axios';

export const usePagar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciar = async (payload: PagoInicio) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.iniciarPago(payload);
      const apiResponse = response.data as any;
      const payloadData = apiResponse?.data;
      setLoading(false);
      return payloadData;
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const message = axiosErr.response?.data?.message || 'Error al iniciar el pago';
      setError(message);
      setLoading(false);
      throw axiosErr;
    }
  };

  return { iniciar, loading, error };
};
