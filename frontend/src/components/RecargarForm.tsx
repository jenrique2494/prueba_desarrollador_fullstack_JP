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
import { RecargaBilletera } from '../api/client';
import { validateRecarga } from '../lib/validations';
import { useRecarga } from '../hooks/useRecarga';

interface RecargarFormProps {
  onSuccess: (newBalance: number) => void;
}

export const RecargarForm: React.FC<RecargarFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    documento: '',
    celular: '',
    valor: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { recargar, error: hookError } = useRecarga();

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
    const result = validateRecarga({ documento: formData.documento, celular: formData.celular, monto: formData.valor });
    setErrors(result.errors);
    return result.valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = await recargar({ documento: formData.documento, celular: formData.celular, valor: Number(formData.valor) } as RecargaBilletera);
      setSuccess(`Se han cargado $${Number(formData.valor).toLocaleString()} exitosamente`);
      setFormData({ documento: '', celular: '', valor: '' });
      setTimeout(() => {
        if (payload?.balance) {
          onSuccess(Number(payload.balance));
        }
      }, 1500);
    } catch (err: any) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        const mapped: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((k) => {
          if (Array.isArray(fieldErrors[k]) && fieldErrors[k].length) mapped[k] = fieldErrors[k][0];
        });
        setErrors(mapped);
      } else {
        setError(hookError || err?.response?.data?.message || 'Error al recargar la billetera');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          💰 Recargar Billetera
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

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
            label="Valor a Cargar"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleChange}
            error={!!errors.valor}
            helperText={errors.valor}
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
            {loading ? 'Recargando...' : 'Recargar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
