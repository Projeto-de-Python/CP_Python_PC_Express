import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

/**
 * GlassCard - Premium glassmorphism card with micro-interactions
 * Inspired by Lusion.co and modern web design
 */
const GlassCard = ({
  children,
  gradient = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  hoverGradient = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
  borderColor = 'rgba(255, 255, 255, 0.2)',
  glowColor = 'rgba(102, 126, 234, 0.4)',
  enableTilt = true,
  enableGlow = true,
  onClick,
  sx = {},
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate tilt based on mouse position
  const calculateTilt = () => {
    if (!enableTilt || !isHovered) return { rotateX: 0, rotateY: 0 };
    
    const rect = document.getElementById('glass-card')?.getBoundingClientRect();
    if (!rect) return { rotateX: 0, rotateY: 0 };
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((mousePosition.y - centerY) / centerY) * -5; // Max 5deg
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5;
    
    return { rotateX, rotateY };
  };

  const tilt = calculateTilt();

  return (
    <motion.div
      id="glass-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        cursor: onClick ? 'pointer' : 'default'
      }}
      {...props}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          background: isHovered ? hoverGradient : gradient,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${borderColor}`,
          boxShadow: isHovered && enableGlow
            ? `0 8px 32px ${glowColor}, 0 0 0 1px ${borderColor}, inset 0 0 20px rgba(255, 255, 255, 0.05)`
            : `0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px ${borderColor}`,
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          ...sx,
          // Animated border on hover
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 3,
            padding: '1px',
            background: isHovered
              ? `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor})`
              : 'transparent',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          },
          // Glossy reflection effect
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
            borderRadius: '24px 24px 0 0',
            pointerEvents: 'none',
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease'
          }
        }}
      >
        {/* Spotlight effect that follows cursor */}
        {enableGlow && isHovered && (
          <Box
            sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              pointerEvents: 'none',
              opacity: 0.5,
              transition: 'opacity 0.3s ease',
              filter: 'blur(40px)'
            }}
          />
        )}
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  gradient: PropTypes.string,
  hoverGradient: PropTypes.string,
  borderColor: PropTypes.string,
  glowColor: PropTypes.string,
  enableTilt: PropTypes.bool,
  enableGlow: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default GlassCard;

