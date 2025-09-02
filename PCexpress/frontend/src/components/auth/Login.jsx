import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Computer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Styled Components - Container com efeitos avançados
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  /* Efeito de parallax no mouse */
  &:hover .parallax-layer {
    transform: translate(var(--mouse-x, 0px), var(--mouse-y, 0px));
  }

  /* Animações adicionais */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Animação de mergulho */
  &.dive-animation {
    animation: diveIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  @keyframes diveIn {
    0% {
      transform: scale(1) translateY(0) rotate(0deg);
      opacity: 1;
    }
    20% {
      transform: scale(1.05) translateY(-10px) rotate(1deg);
      opacity: 0.95;
    }
    40% {
      transform: scale(0.95) translateY(20px) rotate(-1deg);
      opacity: 0.85;
    }
    60% {
      transform: scale(0.7) translateY(80px) rotate(2deg);
      opacity: 0.6;
    }
    80% {
      transform: scale(0.3) translateY(150px) rotate(-2deg);
      opacity: 0.3;
    }
    100% {
      transform: scale(0.05) translateY(300px) rotate(0deg);
      opacity: 0;
    }
  }
`;

// Camadas de parallax
const ParallaxLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.1s ease-out;
  z-index: 0;
`;

const FloatingOrbs = styled(ParallaxLayer)`
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
    filter: blur(20px);
  }

  &::before {
    width: 300px;
    height: 300px;
    top: 15%;
    left: 5%;
    animation-delay: 0s;
  }

  &::after {
    width: 250px;
    height: 250px;
    top: 55%;
    right: 10%;
    animation-delay: 4s;
  }
`;

const EnergyLines = styled(ParallaxLayer)`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(118, 75, 162, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 60%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
    animation: float 12s ease-in-out infinite;
    filter: blur(30px);
  }
`;

const InteractiveParticles = styled(ParallaxLayer)`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(3px 3px at 20px 30px, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(102, 126, 234, 0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(102, 126, 234, 0.15), transparent),
      radial-gradient(1px 1px at 160px 30px, rgba(255, 255, 255, 0.25), transparent),
      radial-gradient(1px 1px at 200px 50px, rgba(255, 255, 255, 0.18), transparent),
      radial-gradient(2px 2px at 240px 90px, rgba(102, 126, 234, 0.12), transparent),
      radial-gradient(1px 1px at 280px 20px, rgba(255, 255, 255, 0.22), transparent),
      radial-gradient(2px 2px at 320px 80px, rgba(102, 126, 234, 0.16), transparent),
      radial-gradient(1px 1px at 360px 40px, rgba(255, 255, 255, 0.19), transparent),
      radial-gradient(2px 2px at 400px 70px, rgba(102, 126, 234, 0.14), transparent),
      radial-gradient(1px 1px at 440px 30px, rgba(255, 255, 255, 0.21), transparent),
      radial-gradient(2px 2px at 480px 60px, rgba(102, 126, 234, 0.13), transparent),
      radial-gradient(1px 1px at 520px 10px, rgba(255, 255, 255, 0.17), transparent),
      radial-gradient(2px 2px at 560px 85px, rgba(102, 126, 234, 0.11), transparent);
    background-repeat: repeat;
    background-size: 600px 400px;
    animation: sparkle 30s linear infinite;
    filter: blur(1px);
  }

  @keyframes sparkle {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    100% {
      transform: translateX(-600px) translateY(-400px);
    }
  }
`;

const LoginCard = styled.div`
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  background: ${props => props.$isDark
    ? 'rgba(26, 26, 46, 0.85)'
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(25px);
  border: ${props => props.$isDark
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid rgba(255, 255, 255, 0.3)'};
  position: relative;
  z-index: 10;
  box-shadow: ${props => props.$isDark
    ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
  
  /* Múltiplas camadas de glassmorphism */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.$isDark 
      ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05), rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05))'
      : 'linear-gradient(45deg, rgba(102, 126, 234, 0.03), rgba(79, 172, 254, 0.03), rgba(102, 126, 234, 0.03), rgba(79, 172, 254, 0.03))'};
    border-radius: 22px;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 50%, 
      rgba(255, 255, 255, 0.05) 100%);
    border-radius: 20px;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: ${props => props.$isDark
      ? '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 30px rgba(102, 126, 234, 0.3)'
      : '0 30px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 30px rgba(102, 126, 234, 0.2)'};
  }

  /* Efeito de brilho no hover */
  &:hover .glow-effect {
    opacity: 1;
    transform: translateX(100%);
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
  opacity: 0;
  border-radius: 20px;
  pointer-events: none;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Efeito de energia sutil */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    right: -20px;
    height: 6px;
    background: radial-gradient(ellipse, 
      rgba(102, 126, 234, 0.08) 0%, 
      transparent 70%);
    animation: pulse 4s ease-in-out infinite;
    filter: blur(5px);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: bounceIn 1s ease-out;
  position: relative;
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Efeito de energia sutil ao redor do logo */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 6s ease-in-out infinite;
    filter: blur(10px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 8s ease-in-out infinite reverse;
    filter: blur(15px);
  }
`;

const StyledComputer = styled(Computer)`
  font-size: 56px;
  color: #667eea;
  filter: ${props => props.$isDark ? 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.6))' : 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))'};
  animation: pulse 3s ease-in-out infinite;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    filter: ${props => props.$isDark ? 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.8))' : 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.5))'};
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const GradientTitle = styled(Typography)`
  && {
    font-weight: 800;
    background: ${props => props.$isDark 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #4facfe 50%, #667eea 100%)'};
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: ${props => props.$isDark ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none'};
    animation: gradientShift 4s ease-in-out infinite;
    position: relative;
    
    @keyframes gradientShift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    /* Efeito de brilho no texto */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }
  }
`;

const SubTitle = styled(Typography)`
  && {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
    font-weight: 500;
    letter-spacing: 0.5px;
    margin-top: 0.5rem;
    animation: fadeIn 1s ease-out 0.5s both;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 1.5rem;
    position: relative;
    
    .MuiOutlinedInput-root {
      border-radius: 12px;
      background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)'};
      border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      /* Efeito de ripple */
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(102, 126, 234, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      
      &:hover::before {
        width: 300px;
        height: 300px;
      }
      
      &:hover {
        background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)'};
        border-color: ${props => props.$isDark ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.3)'};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }
      
      &.Mui-focused {
        background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
      }
    }
    
    .MuiInputLabel-root {
      color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
      font-weight: 500;
      transition: all 0.3s ease;
      
      &.Mui-focused {
        color: #667eea;
        transform: translateY(-2px);
      }
    }

    .MuiInputBase-input {
      color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
      font-weight: 500;
      transition: all 0.3s ease;
    }
  }
`;

const GradientButton = styled(Button)`
  && {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    padding: 16px 32px;
    border-radius: 16px;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: none;
    background: ${props => props.$isDark 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #4facfe 50%, #667eea 100%)'};
    background-size: 200% 200%;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    /* Efeito de ripple personalizado */
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    &:active::before {
      width: 300px;
      height: 300px;
    }
    
    &:hover {
      background-position: right center;
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6), 0 0 20px rgba(102, 126, 234, 0.3);
      transform: translateY(-3px) scale(1.02);
    }
    
    &:active {
      transform: translateY(-1px) scale(0.98);
    }
    
    &:disabled {
      background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      box-shadow: none;
      transform: none;
    }

    /* Efeito de brilho no hover */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }

    &:hover::after {
      left: 100%;
    }
  }
`;

const StyledLink = styled(Link)`
  && {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 8px 16px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.3s;
    }
    
    &:hover {
      color: #5a6fd8;
      background: rgba(102, 126, 234, 0.1);
      text-decoration: none;
      transform: translateY(-1px);
    }
    
    &:hover::before {
      left: 100%;
    }
  }
`;

const DemoCredentials = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(102, 126, 234, 0.08)'};
  border: ${props => props.$isDark
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid rgba(102, 126, 234, 0.15)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* Efeito de borda luminosa */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: ${props => props.$isDark 
      ? 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #667eea)'
      : 'linear-gradient(45deg, #667eea, #4facfe, #667eea, #4facfe)'};
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    border-color: ${props => props.$isDark
      ? 'rgba(102, 126, 234, 0.3)'
      : 'rgba(102, 126, 234, 0.3)'};
  }
`;

const DemoText = styled(Typography)`
  && {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
    text-align: center;
    font-weight: 600;
    margin: 0;
    line-height: 1.6;
    position: relative;
    z-index: 1;
    
    strong {
      color: #667eea;
      font-weight: 700;
      text-shadow: ${props => props.$isDark ? '0 0 10px rgba(102, 126, 234, 0.3)' : 'none'};
      animation: pulse 2s ease-in-out infinite;
    }
  }
`;

const Login = ({ onAcceleration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDiving, setIsDiving] = useState(false);
  const containerRef = useRef(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  // Efeito de parallax no mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.01;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.01;
        
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
         if (result.success) {
       // Marca que veio do login para ativar animação no dashboard
       sessionStorage.setItem('fromLogin', 'true');
       
       // Inicia a animação de mergulho
       setIsDiving(true);
       
       // Ativa a aceleração das partículas
       if (onAcceleration) {
         onAcceleration(true);
         
         // Desativa a aceleração após o mergulho
         setTimeout(() => {
           onAcceleration(false);
         }, 1500);
       }
       
       // Aguarda a animação terminar antes de navegar
       setTimeout(() => {
         navigate('/');
       }, 1500); // Duração da animação diveIn
     } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="sm" disableGutters>
      <LoginContainer 
        ref={containerRef} 
        $isDark={isDark}
        className={isDiving ? 'dive-animation' : ''}
      >
        {/* Camadas de parallax */}
        <FloatingOrbs className="parallax-layer" />
        <EnergyLines className="parallax-layer" />
        <InteractiveParticles className="parallax-layer" />
        
        <LoginCard $isDark={isDark}>
          <GlowEffect className="glow-effect" />
          
          <LogoSection>
            <LogoContainer>
              <StyledComputer $isDark={isDark} />
            </LogoContainer>
            <GradientTitle variant="h3" component="h1" gutterBottom $isDark={isDark}>
              PC Express
            </GradientTitle>
            <SubTitle variant="h6" $isDark={isDark}>
              {t('auth.login')}
            </SubTitle>
          </LogoSection>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                background: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: isDark ? '1px solid rgba(244, 67, 54, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)',
                animation: 'fadeIn 0.5s ease-out',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ 
            marginTop: '8px',
            animation: 'slideInUp 0.8s ease-out 0.2s both'
          }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $isDark={isDark}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $isDark={isDark}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          color: '#667eea',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <GradientButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              $isDark={isDark}
            >
              {loading ? (
                <span style={{ opacity: 0.8 }}>Entrando...</span>
              ) : (
                t('auth.loginButton')
              )}
            </GradientButton>
            
            <div style={{ textAlign: 'center' }}>
              <StyledLink 
                component={RouterLink} 
                to="/register" 
                variant="body2"
              >
                {t('auth.dontHaveAccount')}
              </StyledLink>
            </div>
          </form>

          <DemoCredentials $isDark={isDark} style={{ animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
            <DemoText variant="body2" $isDark={isDark}>
              <strong>Demo Credentials:</strong>
              <br />
              Email: admin@pc-express.com
              <br />
              Password: admin123
            </DemoText>
          </DemoCredentials>
        </LoginCard>
      </LoginContainer>
    </Container>
  );
};

Login.propTypes = {
  onAcceleration: PropTypes.func
};

export default Login;
