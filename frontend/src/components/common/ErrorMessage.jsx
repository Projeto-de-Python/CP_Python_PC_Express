import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export const ErrorMessage = ({ 
  error, 
  onRetry, 
  onClose, 
  title = 'Error',
  showRetry = true,
  showClose = true,
  severity = 'error'
}) => {
  if (!error) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity={severity} 
        onClose={showClose ? onClose : undefined}
        icon={<AlertTriangle />}
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <Box>
          <Typography variant="body1" fontWeight="600" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error}
          </Typography>
          {showRetry && onRetry && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshCw size={16} />}
              onClick={onRetry}
              sx={{ mt: 1 }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Alert>
    </Box>
  );
};
