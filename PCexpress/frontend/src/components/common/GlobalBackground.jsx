import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GlobalBackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a1929 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #4facfe 25%, #667eea 50%, #4facfe 75%, #667eea 100%)'};
  background-size: 400% 400%;
  animation: gradientShift 20s ease-in-out infinite;

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 50%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isDark 
      ? 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(79, 172, 254, 0.2) 0%, transparent 50%)'};
    animation: float 25s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.15), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.25), transparent);
    background-repeat: repeat;
    background-size: 750px 500px;
    animation: ${props => props.$isAccelerating ? 'sparkleAccelerating 3s linear infinite' : 'sparkle 25s linear infinite'};
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-30px) rotate(1deg);
    }
    66% {
      transform: translateY(15px) rotate(-1deg);
    }
  }

  @keyframes sparkle {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    100% {
      transform: translateX(-750px) translateY(-500px);
    }
  }

  @keyframes sparkleAccelerating {
    0% {
      transform: translateX(0px) translateY(0px) scale(1);
    }
    100% {
      transform: translateX(-750px) translateY(-500px) scale(2.5);
    }
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: ${props => props.$isDark 
      ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))'
      : 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(79, 172, 254, 0.05))'};
    clip-path: polygon(0 100%, 100% 100%, 100% 70%, 0 50%);
    animation: wave 12s ease-in-out infinite;
  }

  .wave:nth-child(2) {
    animation-delay: -3s;
    opacity: 0.4;
    clip-path: polygon(0 100%, 100% 100%, 100% 60%, 0 40%);
  }

  .wave:nth-child(3) {
    animation-delay: -6s;
    opacity: 0.2;
    clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 30%);
  }

  @keyframes wave {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-30px);
    }
  }

  .mist {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    animation: mist 30s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes mist {
    0%, 100% {
      opacity: 0.3;
      transform: translateX(0) translateY(0);
    }
    50% {
      opacity: 0.6;
      transform: translateX(-20px) translateY(-10px);
    }
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 10px 20px, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 30px 40px, rgba(255, 255, 255, 0.08), transparent),
      radial-gradient(1px 1px at 50px 60px, rgba(255, 255, 255, 0.12), transparent);
    background-repeat: repeat;
    background-size: 100px 100px;
    animation: particles 40s linear infinite;
    pointer-events: none;
  }

  @keyframes particles {
    0% {
      transform: translateX(0) translateY(0);
    }
    100% {
      transform: translateX(-100px) translateY(-100px);
    }
  }
`;

const GlobalBackground = ({ isDark = false, isAccelerating = false, children }) => {
  return (
    <GlobalBackgroundContainer $isDark={isDark} $isAccelerating={isAccelerating}>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="mist"></div>
      <div className="particles"></div>
      {children}
    </GlobalBackgroundContainer>
  );
};

GlobalBackground.propTypes = {
  isDark: PropTypes.bool,
  isAccelerating: PropTypes.bool,
  children: PropTypes.node,
};

export default GlobalBackground;
