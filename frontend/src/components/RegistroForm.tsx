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
import { Cliente } from '../api/client';
import { useRegistro } from '../hooks/useRegistro';

interface RegistroFormProps {
  onSuccess: (cliente: Cliente) => void;
}

export const RegistroForm: React.FC<RegistroFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    documento: '',
    nombres: '',
    email: '',
    celular: '',
  });

  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState('');
  const { registrar, loading, error } = useRegistro();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.documento.trim()) {
      errors.documento = 'El documento es requerido';
    }
    if (!formData.nombres.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    if (!formData.celular.trim()) {
      errors.celular = 'El celular es requerido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await registrar(formData);
      setSuccessMessage('¡Cliente registrado exitosamente!');
      setFormData({ documento: '', nombres: '', email: '', celular: '' });
      setTimeout(() => {
        if (response) {
          onSuccess(response as any);
        }
      }, 1500);
    } catch (err) {
      // Error ya está en el state del hook
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📝 Registrar Cliente
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
            error={!!validationErrors.documento}
            helperText={validationErrors.documento}
            disabled={loading}
            fullWidth
            placeholder="Ingresa tu documento"
          />

          <TextField
            label="Nombres Completos"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            error={!!validationErrors.nombres}
            helperText={validationErrors.nombres}
            disabled={loading}
            fullWidth
            placeholder="Juan Pérez García"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            disabled={loading}
            fullWidth
            placeholder="tu@email.com"
          />

          <TextField
            label="Celular"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            error={!!validationErrors.celular}
            helperText={validationErrors.celular}
            disabled={loading}
            fullWidth
            placeholder="3001234567"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
