import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { LogOut, RotateCcw } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = ({ open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    onClose();
    navigate('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <LogOut size={24} color="#f44336" />
          <Typography variant="h6" color="error">
            Sessão Expirada
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Sua sessão expirou por motivos de segurança.
        </Alert>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Por motivos de segurança, sua sessão foi encerrada automaticamente após um período de inatividade.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Você pode fazer login novamente ou atualizar a página para tentar reconectar.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<RotateCcw />}
          onClick={handleRefresh}
          sx={{ minWidth: 120 }}
        >
          Atualizar
        </Button>

        <Button
          variant="contained"
          startIcon={<LogOut />}
          onClick={handleLogout}
          color="primary"
          sx={{ minWidth: 120 }}
        >
          Fazer Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SessionExpiredModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default SessionExpiredModal;
