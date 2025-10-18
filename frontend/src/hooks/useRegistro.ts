import { useState } from 'react';
import { apiClient, Cliente } from '../api/client';
import { AxiosError } from 'axios';

export const useRegistro = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrar = async (cliente: Cliente) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.registroCliente(cliente);
      const apiResponse = response.data as any;
      const payloadData = apiResponse?.data;
      setLoading(false);
      return payloadData;
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const message =
        axiosError.response?.data?.message ||
        'Error al registrar el cliente';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  return { registrar, loading, error };
};
