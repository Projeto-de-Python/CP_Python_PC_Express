import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chartColors } from '../../utils/chartUtils';

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  trend, 
  subtitle, 
  route,
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        background: gradient || chartColors.gradientColors.primary,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {trend > 0 ? (
                <TrendingUp size={16} color="rgba(255,255,255,0.8)" />
              ) : (
                <TrendingDown size={16} color="rgba(255,255,255,0.8)" />
              )}
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
