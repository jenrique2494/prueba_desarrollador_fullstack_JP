import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { apiClient, Saldo } from '../api/client';
import { WalletCard } from './WalletCard';

interface ConsultarSaldoFormProps {
  onSuccess?: (saldo: Saldo) => void;
  onError?: (error: string) => void;
}

export const ConsultarSaldoForm: React.FC<ConsultarSaldoFormProps> = ({ 
  onSuccess,
  onError 
}) => {
  const [formData, setFormData] = React.useState({
    documento: '',
    celular: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saldo, setSaldo] = React.useState<Saldo | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};

    if (!formData.documento.trim()) {
      validationErrors.documento = 'El documento es requerido';
    }
    if (!formData.celular.trim()) {
      validationErrors.celular = 'El celular es requerido';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.consultarSaldo(
        formData.documento,
        formData.celular
      );

      // Axios response: response.data -> ApiResponse, ApiResponse.data -> payload
      const apiResponse = (response as any).data;
      const rawData = apiResponse?.data ?? apiResponse;

      const safeSaldo = {
        cliente_id: rawData?.cliente_id ?? null,
        documento: rawData?.documento ?? '',
        nombres: rawData?.nombres ?? '',
        email: rawData?.email ?? '',
        celular: rawData?.celular ?? '',
        balance: Number(rawData?.balance ?? 0),
        saldo_disponible: Number(rawData?.saldo_disponible ?? 0),
      };

      setSaldo(safeSaldo);
      onSuccess?.(safeSaldo);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Error al consultar el saldo';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccountBalanceIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h5">
              🔍 Consultar Saldo
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              error={!!errors.documento}
              helperText={errors.documento}
              disabled={loading}
              fullWidth
              placeholder="Ej: 1234567890"
            />

            <TextField
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              error={!!errors.celular}
              helperText={errors.celular}
              disabled={loading}
              fullWidth
              placeholder="Ej: 3001234567"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              {loading ? 'Consultando...' : 'Consultar Saldo'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {saldo && (
        <Box sx={{ mt: 3 }}>
          <WalletCard saldo={saldo} />
        </Box>
      )}
    </Box>
  );
};
