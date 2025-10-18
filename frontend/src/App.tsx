import React, { useState } from 'react';
import {
  Box,
  // Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme';
import { RegistroForm } from './components/RegistroForm';
import { RecargarForm } from './components/RecargarForm';
import { PagarForm } from './components/PagarForm';
import { ConfirmarPagoForm } from './components/ConfirmarPagoForm';
import { ConsultarSaldoForm } from './components/ConsultarSaldoForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PagoState {
  sessionId: string | null;
  token: string | null;
  monto: number | null;
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [pagoState, setPagoState] = useState<PagoState>(() => {
    // Inicializar desde localStorage si existe
    const stored = localStorage.getItem('pagoState');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { sessionId: null, token: null, monto: null };
      }
    }
    return { sessionId: null, token: null, monto: null };
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRegistroSuccess = (cliente: any) => {
    setSuccessMessage(`¡Bienvenido ${cliente.nombres}! Tu cuenta ha sido creada exitosamente.`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleRecargarSuccess = (newBalance: number) => {
    setSuccessMessage('¡Recarga realizada exitosamente!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handlePagarSuccess = (sessionId: string, token: string, monto: number) => {
    const newState = { sessionId, token, monto };
    setPagoState(newState);
    localStorage.setItem('pagoState', JSON.stringify(newState));
    setTabValue(3); // Cambiar a pestaña de confirmación
    setSuccessMessage(`Pago iniciado. ID de Sesión: ${sessionId}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleConfirmarPagoSuccess = (newBalance: number) => {
    setPagoState({ sessionId: null, token: null, monto: null });
    localStorage.removeItem('pagoState');
    setSuccessMessage('¡Pago confirmado exitosamente!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f9fafb' }}>
        {/* Header */}
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #0066ff 0%, #00a3e6 100%)' }}>
          <Toolbar>
            <PaidIcon sx={{ mr: 2, fontSize: 32, color: 'rgba(255,255,255,0.95)' }} aria-hidden />
            <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }} component="h1">
              ePayco — Billetera de Prueba
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Box sx={{ width: '100%', maxWidth: 1200, px: { xs: 2, sm: 4 } }}>
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            )}

            {/* Navigation Tabs + Content Card (unified) */}
            <Paper
              elevation={2}
              sx={{
                mb: 3,
                width: '100%',
                mx: 'auto',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 6px 18px rgba(2,6,23,0.08)'
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                centered
                sx={{
                  borderBottom: '1px solid #e6eef7',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)'
                }}
              >
                <Tab sx={{ minWidth: 140 }} label="📝 Registro" id="tab-0" aria-controls="tabpanel-0" />
                <Tab sx={{ minWidth: 140 }} label="💰 Recargar" id="tab-1" aria-controls="tabpanel-1" />
                <Tab sx={{ minWidth: 140 }} label="💳 Pagar" id="tab-2" aria-controls="tabpanel-2" />
                <Tab sx={{ minWidth: 140 }} label="✅ Confirmar Pago" id="tab-3" aria-controls="tabpanel-3" />
                <Tab sx={{ minWidth: 140 }} label="🔍 Consultar Saldo" id="tab-4" aria-controls="tabpanel-4" />
              </Tabs>

              {/* Panels container: white background, matching width, no extra shadow, flush with tabs */}
              <Box sx={{ bgcolor: '#ffffff', p: { xs: 2, sm: 3 } }}>
                <TabPanel value={tabValue} index={0}>
                  <RegistroForm onSuccess={handleRegistroSuccess} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <RecargarForm onSuccess={handleRecargarSuccess} />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <PagarForm onSuccess={handlePagarSuccess} />
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  {pagoState.sessionId ? (
                    <ConfirmarPagoForm
                      sessionId={pagoState.sessionId}
                      token={pagoState.token || ''}
                      monto={pagoState.monto || 0}
                      onSuccess={handleConfirmarPagoSuccess}
                    />
                  ) : (
                    <Alert severity="info">
                      Por favor, primero inicia un pago desde la pestaña "💳 Pagar"
                    </Alert>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                  <ConsultarSaldoForm />
                </TabPanel>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: '#f0f0f0',
            py: 2,
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1200 }}>
            <Typography variant="body2" color="textSecondary">
              © 2024 ePayco - Billetera Virtual. Todos los derechos reservados.
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Sistema de prueba para desarrolladores
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
