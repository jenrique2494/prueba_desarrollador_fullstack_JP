import { useState } from 'react';
import { apiClient, RecargaBilletera } from '../api/client';
import { AxiosError } from 'axios';

export const useRecarga = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = async (payload: RecargaBilletera) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.recargarBilletera(payload);
      const apiResponse = response.data as any;
      const payloadData = apiResponse?.data;
      setLoading(false);
      return payloadData;
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const message = axiosErr.response?.data?.message || 'Error al recargar la billetera';
      setError(message);
      setLoading(false);
      throw axiosErr;
    }
  };

  return { recargar, loading, error };
};
