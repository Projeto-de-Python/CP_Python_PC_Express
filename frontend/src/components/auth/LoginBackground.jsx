import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import {
    AnimatedGradient,
    GlobalStyles,
    InteractiveBackground,
    LoginContainer,
    Particle,
    ParticlesContainer,
    WaveEffect
} from './LoginStyles';

const LoginBackground = ({ isDark, children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Gerar partículas
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
      });
    }
    return particles;
  };

  const [particles] = useState(generateParticles());

  // Efeito de mouse para fundo interativo
  useEffect(() => {
    const handleMouseMove = e => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <>
      <GlobalStyles />
      <LoginContainer $isDark={isDark} ref={containerRef}>

        {/* Partículas dinâmicas */}
        <ParticlesContainer>
          {particles.map(particle => (
            <Particle
              key={particle.id}
              $x={particle.x}
              $y={particle.y}
              $size={particle.size}
              $opacity={particle.opacity}
              $duration={particle.duration}
              $delay={particle.delay}
              $isDark={isDark}
            />
          ))}
        </ParticlesContainer>

        {/* Efeito de fundo interativo sutil */}
        <InteractiveBackground
          $mouseX={mousePosition.x}
          $mouseY={mousePosition.y}
          $isDark={isDark}
        />

        {/* Efeito de gradiente animado */}
        <AnimatedGradient $isDark={isDark} />

        {/* Efeito de ondas no background */}
        <WaveEffect $isDark={isDark} />

        {children}
      </LoginContainer>
    </>
  );
};

LoginBackground.propTypes = {
  isDark: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default LoginBackground;
