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
  Paper,
} from '@mui/material';
import { apiClient, PagoConfirmacion } from '../api/client';

interface ConfirmarPagoFormProps {
  sessionId: string;
  token: string;
  monto: number;
  onSuccess: (newBalance: number) => void;
}

export const ConfirmarPagoForm: React.FC<ConfirmarPagoFormProps> = ({
  sessionId,
  token: initialToken,
  monto,
  onSuccess,
}) => {
  const [token, setToken] = React.useState(initialToken);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState('');
  const [tokenError, setTokenError] = React.useState('');

  const validateToken = (): boolean => {
    if (!token.trim()) {
      setTokenError('El token es requerido');
      return false;
    }
    if (token.length !== 6 || isNaN(Number(token))) {
      setTokenError('El token debe ser 6 dígitos');
      return false;
    }
    setTokenError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateToken()) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.confirmarPago({
        session_id: sessionId,
        token: token,
      } as PagoConfirmacion);

      setSuccess('¡Pago confirmado exitosamente!');
      setToken('');

      setTimeout(() => {
        onSuccess(0); // Aquí obtendrías el nuevo balance del backend
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al confirmar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ✅ Confirmar Pago
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

        <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="body2" color="textSecondary">
            ID de Sesión: <strong>{sessionId}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monto: <strong>${monto.toLocaleString()}</strong>
          </Typography>
        </Paper>

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
            label="Token (6 dígitos)"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={!!tokenError}
            helperText={tokenError}
            disabled={loading}
            fullWidth
            inputProps={{ maxLength: 6 }}
            placeholder="000000"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {loading ? 'Confirmando...' : 'Confirmar Pago'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          💡 En desarrollo, el token está disponible en la respuesta del pago iniciado
        </Alert>
      </CardContent>
    </Card>
  );
};
