import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Card, Button, Typography, Paper, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Gradientes reutilizáveis
const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  error: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
};

// Card de estatísticas principal
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
        background: gradient || gradients.primary,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: onClick || route ? 'pointer' : 'default',
        borderRadius: '16px',
        '&:hover': {
          transform: onClick || route ? 'translateY(-4px)' : 'none',
          boxShadow: onClick || route ? '0 8px 25px rgba(0,0,0,0.2)' : 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, padding: '24px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {icon}
            </Box>
          )}
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

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  gradient: PropTypes.string,
  trend: PropTypes.number,
  subtitle: PropTypes.string,
  route: PropTypes.string,
  onClick: PropTypes.func
};

// Botão com gradiente moderno
export const GradientButton = styled(Button)(({ theme, variant = 'primary' }) => ({
  background: gradients[variant] || gradients.primary,
  border: 'none',
  borderRadius: '12px',
  padding: '12px 24px',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    '&::before': {
      left: '100%',
    }
  },
  '&:active': {
    transform: 'translateY(0)',
  }
}));

// Card com efeito glassmorphism
export const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }
}));

// Typography com gradiente
export const GradientText = styled(Typography)(({ theme, gradient = 'primary' }) => ({
  background: gradients[gradient] || gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  display: 'inline-block',
}));

// Container com gradiente de fundo
export const GradientContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  padding: theme.spacing(3),
  color: '#333',
}));

// Paper com efeito glassmorphism
export const GlassPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

// Loading spinner animado
export const AnimatedSpinner = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  borderTop: '3px solid #667eea',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
}));

// Exportar gradientes para uso externo
export { gradients };