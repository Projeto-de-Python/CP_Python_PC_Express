import React from 'react';
import { Box, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import { HelpCircle } from 'lucide-react';
import { getChartTheme } from '../../utils/chartUtils';
import { useTranslation } from 'react-i18next';

export const ChartWrapper = ({ 
  title, 
  icon, 
  children, 
  darkMode, 
  tooltip, 
  expanded, 
  onToggleExpand,
  color = 'primary',
  sx = {} 
}) => {
  const theme = getChartTheme(darkMode);
  const { t } = useTranslation();
  
  return (
    <Box
      onClick={onToggleExpand}
      sx={{
        height: expanded ? 500 : 400,
        transition: 'all 0.3s ease',
        position: 'relative',
        p: 3,
        borderRadius: 2,
        background: theme.background,
        backdropFilter: 'blur(10px)',
        border: theme.border,
        cursor: onToggleExpand ? 'pointer' : 'default',
        '&:hover': onToggleExpand ? {
          boxShadow: darkMode 
            ? `0 8px 32px rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(102, 126, 234, 0.2), 0 0 15px rgba(102, 126, 234, 0.15)` 
            : `0 8px 32px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(102, 126, 234, 0.2), 0 0 20px rgba(102, 126, 234, 0.1)`,
          transform: 'translateY(-2px)',
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 2,
          background: darkMode 
            ? 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        ...sx
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight="600" sx={{ color: `#667eea` }}>
            {icon}
            {title}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip}>
              <IconButton sx={{ 
                color: '#667eea',
                '&:hover': { 
                  color: '#764ba2',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}>
                <HelpCircle size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {onToggleExpand && (
          <Chip
            label={expanded ? t('common.clickToMinimize') : t('common.clickToExpand')}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        {children}
      </Box>
    </Box>
  );
};
