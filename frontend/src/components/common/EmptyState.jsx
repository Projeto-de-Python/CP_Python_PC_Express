import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Paper } from '@mui/material';
import { chartColors } from '../../utils/chartUtils';

export const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  showAction = true,
  sx = {}
}) => {
  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
        ...sx
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {Icon && (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${chartColors.primary}20 0%, ${chartColors.secondary}20 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${chartColors.primary}40`,
            }}
          >
            <Icon size={40} color={chartColors.primary} />
          </Box>
        )}
        
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 400 }}>
          {description}
        </Typography>
        
        {showAction && actionLabel && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
            sx={{
              mt: 2,
              background: chartColors.gradientColors.primary,
              '&:hover': {
                background: chartColors.gradientColors.secondary,
              },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  showAction: PropTypes.bool,
  sx: PropTypes.object
};
