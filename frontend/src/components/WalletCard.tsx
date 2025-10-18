import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Saldo } from '../api/client';

interface WalletCardProps {
  saldo?: Saldo;
  isLoading?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({ saldo, isLoading = false }) => {
  if (!saldo) return null;

  const saldoDisponible = Number(saldo.saldo_disponible ?? 0);
  const balanceTotal = Number(saldo.balance ?? 0);

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2">Saldo Disponible</Typography>
              <Typography variant="h4">${saldoDisponible.toLocaleString('es-CO')}</Typography>
            </Box>
            <AccountBalanceWalletIcon />
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Box>
              <Typography variant="caption">Nombres</Typography>
              <Typography variant="body2">{saldo.nombres || 'No disponible'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption">Documento</Typography>
              <Typography variant="body2">{saldo.documento || 'No disponible'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption">Email</Typography>
              <Typography variant="body2">{saldo.email || 'No disponible'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption">Celular</Typography>
              <Typography variant="body2">{saldo.celular || 'No disponible'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <Typography variant="caption">Balance Total</Typography>
              <Typography variant="h6">${balanceTotal.toLocaleString('es-CO')}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
