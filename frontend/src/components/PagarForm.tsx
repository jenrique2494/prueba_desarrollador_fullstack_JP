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
import { apiClient, PagoInicio } from '../api/client';

interface PagarFormProps {
  onSuccess: (sessionId: string, token: string, monto: number) => void;
}

export const PagarForm: React.FC<PagarFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    documento: '',
    celular: '',
    monto: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

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
    if (!formData.monto.trim()) {
      validationErrors.monto = 'El monto es requerido';
    } else if (isNaN(Number(formData.monto)) || Number(formData.monto) <= 0) {
      validationErrors.monto = 'El monto debe ser un número positivo';
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
      const response = await apiClient.iniciarPago({
        documento: formData.documento,
        celular: formData.celular,
        monto: Number(formData.monto),
      } as PagoInicio);

      // response es AxiosResponse, response.data es ApiResponse
      const apiResponse = response.data as any;
      const payloadData = apiResponse?.data;
      
      if (payloadData?.session_id) {
        onSuccess(payloadData.session_id, payloadData.token_debug || '', Number(formData.monto));
        setFormData({ documento: '', celular: '', monto: '' });
      } else {
        setError('No se recibió ID de sesión');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          💳 Iniciar Pago
        </Typography>

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
          />

          <TextField
            label="Monto a Pagar"
            name="monto"
            type="number"
            value={formData.monto}
            onChange={handleChange}
            error={!!errors.monto}
            helperText={errors.monto}
            disabled={loading}
            fullWidth
            inputProps={{ step: '0.01', min: '0' }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {loading ? 'Iniciando...' : 'Iniciar Pago'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
