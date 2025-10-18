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
import { PagoInicio } from '../api/client';
import { validatePagar } from '../lib/validations';
import { usePagar } from '../hooks/usePagar';

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

  const { iniciar, error: hookError } = usePagar();

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
    const result = validatePagar({ documento: formData.documento, celular: formData.celular, monto: formData.monto });
    setErrors(result.errors);
    return result.valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = await iniciar({ documento: formData.documento, celular: formData.celular, monto: Number(formData.monto) } as PagoInicio);
      if (payload?.session_id) {
        onSuccess(payload.session_id, payload.token_debug || '', Number(formData.monto));
        setFormData({ documento: '', celular: '', monto: '' });
      } else {
        setError('No se recibió ID de sesión');
      }
    } catch (err: any) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        const mapped: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((k) => {
          if (Array.isArray(fieldErrors[k]) && fieldErrors[k].length) mapped[k] = fieldErrors[k][0];
        });
        setErrors(mapped);
      } else {
        setError(hookError || err?.response?.data?.message || 'Error al iniciar el pago');
      }
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
