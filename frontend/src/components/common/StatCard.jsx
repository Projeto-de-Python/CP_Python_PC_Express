import { CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { chartColors } from '../../utils/chartUtils';
import GlassCard from './GlassCard';

export const StatCard = ({ title, value, icon, gradient, trend, subtitle, route, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  // Extract colors from gradient for glow effect
  const extractGlowColor = (gradientString) => {
    if (!gradientString) return 'rgba(102, 126, 234, 0.4)';
    // Simple extraction - get first rgb/rgba color
    const match = gradientString.match(/rgba?\([^)]+\)/);
    if (match) {
      const color = match[0];
      // Add opacity for glow
      return color.replace(/[\d.]+\)$/, '0.4)');
    }
    return 'rgba(102, 126, 234, 0.4)';
  };

  const glowColor = extractGlowColor(gradient);

  return (
    <GlassCard
      gradient={gradient || chartColors.gradientColors.primary}
      hoverGradient={gradient || chartColors.gradientColors.primary}
      glowColor={glowColor}
      borderColor="rgba(255, 255, 255, 0.2)"
      enableTilt={true}
      enableGlow={true}
      onClick={handleClick}
      sx={{ height: '100%' }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
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
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  '& > *': {
                    fontSize: '24px',
                    width: '24px',
                    height: '24px'
                  }
                }}
              >
                {icon}
              </Box>
            </Box>
          </motion.div>
          
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{
                  background: trend > 0 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : 'rgba(239, 68, 68, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  border: `1px solid ${trend > 0 
                    ? 'rgba(34, 197, 94, 0.3)' 
                    : 'rgba(239, 68, 68, 0.3)'}`
                }}
              >
                {trend > 0 ? (
                  <TrendingUp size={16} color="rgba(34, 197, 94, 1)" />
                ) : (
                  <TrendingDown size={16} color="rgba(239, 68, 68, 1)" />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend > 0 
                      ? 'rgba(34, 197, 94, 1)' 
                      : 'rgba(239, 68, 68, 1)',
                    fontWeight: 'bold'
                  }}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            </motion.div>
          )}
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              color: 'white'
            }}
          >
            {value}
          </Typography>
        </motion.div>

        <Typography 
          variant="h6" 
          fontWeight="600" 
          gutterBottom
          sx={{ 
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1
            }}
          >
            <Box
              component="span"
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                display: 'inline-block'
              }}
            />
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </GlassCard>
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
