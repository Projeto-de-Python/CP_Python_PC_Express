import styled, { createGlobalStyle } from 'styled-components';

// Estilos globais para garantir cobertura total da viewport
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }
`;

// Styled Components - Layout moderno para widescreen
export const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 25%, #1a1a2e 50%, #16213e 75%, #0f1419 100%)'
      : 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 25%, #1a1a2e 50%, #16213e 75%, #0f1419 100%)'};
  background-size: cover;
  background-attachment: fixed;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props =>
      props.$isDark
        ? 'radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 191, 255, 0.06) 0%, transparent 70%)'
        : 'radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 191, 255, 0.06) 0%, transparent 70%)'};
    pointer-events: none;
    transition: all 0.3s ease;
  }
`;

// Componente de partículas
export const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

export const Particle = styled.div`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props =>
    props.$isDark
      ? 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.4) 50%, transparent 100%)'
      : 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.4) 50%, transparent 100%)'};
  border-radius: 50%;
  opacity: ${props => props.$opacity};
  animation: float ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  filter: blur(0.5px);

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) translateX(0px) scale(1);
      opacity: ${props => props.$opacity};
    }
    25% {
      transform: translateY(-20px) translateX(10px) scale(1.1);
      opacity: ${props => props.$opacity * 0.8};
    }
    50% {
      transform: translateY(-10px) translateX(-15px) scale(0.9);
      opacity: ${props => props.$opacity * 1.2};
    }
    75% {
      transform: translateY(-30px) translateX(5px) scale(1.05);
      opacity: ${props => props.$opacity * 0.9};
    }
  }
`;

// Botão de troca de tema
export const ThemeToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: ${props => (props.$isDark ? 'rgba(15, 15, 25, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border: 1px solid
    ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.3)')};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 255, 0.8)')};

  &:hover {
    background: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0, 255, 255, 0.15)')};
    border-color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 255, 0.6)')};
    transform: scale(1.1);
    box-shadow: 0 0 20px
      ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.3)')};
  }
`;

// Efeito de fundo interativo
export const InteractiveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  --mouse-x: ${props => props.$mouseX}%;
  --mouse-y: ${props => props.$mouseY}%;
  background: ${props =>
    props.$isDark
      ? 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
`;

// Efeito de gradiente animado
export const AnimatedGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props =>
    props.$isDark
      ? 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
`;

// Efeito de ondas no background
export const WaveEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props =>
    props.$isDark
      ? 'radial-gradient(ellipse at 30% 20%, rgba(0, 255, 255, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(ellipse at 30% 20%, rgba(0, 255, 255, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)'};
  animation: wave 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  @keyframes wave {
    0%,
    100% {
      transform: translateX(0px) translateY(0px) scale(1);
      opacity: 0.5;
    }
    25% {
      transform: translateX(-10px) translateY(-5px) scale(1.05);
      opacity: 0.7;
    }
    50% {
      transform: translateX(5px) translateY(-10px) scale(0.95);
      opacity: 0.6;
    }
    75% {
      transform: translateX(-5px) translateY(5px) scale(1.02);
      opacity: 0.8;
    }
  }
`;

export const LoginWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex: none;
    min-height: 40vh;
    padding: 1rem;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex: none;
    min-height: 60vh;
    padding: 1rem;
  }
`;

// Efeito de hover para os painéis
export const HoverEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props =>
    props.$isDark
      ? 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.15) 0%, transparent 50%)'};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;

  ${props =>
    props.$isHovered &&
    `
    opacity: 1;
  `}
`;

// Card de login
export const LoginCard = styled.div`
  background: ${props => (props.$isDark ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)')};
  backdrop-filter: blur(20px);
  border: ${props =>
    props.$isDark ? '1px solid rgba(0, 255, 255, 0.3)' : '1px solid rgba(0, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: ${props =>
    props.$isDark
      ? '0 8px 32px rgba(0, 255, 255, 0.1), 0 0 0 1px rgba(0, 255, 255, 0.05)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 255, 255, 0.05)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props =>
      props.$isDark
        ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(138, 43, 226, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%, rgba(138, 43, 226, 0.05) 100%)'};
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${props =>
      props.$isDark
        ? '0 12px 40px rgba(0, 255, 255, 0.15), 0 0 0 1px rgba(0, 255, 255, 0.1)'
        : '0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 255, 255, 0.1)'};
  }
`;

// Seção do logo
export const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const FormLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const FormComputer = styled.div`
  width: 60px;
  height: 60px;
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
      : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props =>
    props.$isDark ? '0 4px 20px rgba(0, 255, 255, 0.3)' : '0 4px 20px rgba(0, 255, 255, 0.3)'};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: ${props =>
        props.$isDark ? '0 4px 20px rgba(0, 255, 255, 0.3)' : '0 4px 20px rgba(0, 255, 255, 0.3)'};
    }
    50% {
      transform: scale(1.05);
      box-shadow: ${props =>
        props.$isDark ? '0 6px 25px rgba(0, 255, 255, 0.4)' : '0 6px 25px rgba(0, 255, 255, 0.4)'};
    }
  }
`;

export const GradientTitle = styled.h2`
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
      : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2rem;
`;

export const SubTitle = styled.h6`
  color: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)')};
  font-weight: 400;
  margin-bottom: 0;
`;

// Campos de texto estilizados
export const StyledTextField = styled.div`
  .MuiTextField-root {
    margin: 8px 0;
  }

  .MuiInputLabel-root {
    color: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)')};
  }

  .MuiInputBase-root {
    background: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)')};
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 0 rgba(0,255,255,0);

    &:hover {
      background: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};
    }

    &.Mui-focused {
      background: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)')};
      box-shadow: 0 0 0 4px ${props => (props.$isDark ? 'rgba(0,255,255,0.12)' : 'rgba(0,255,255,0.12)')};
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.3)')};
    transition: all 0.3s ease;
  }

  .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 0.5)')};
  }

  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 255, 0.8)')};
    border-width: 2px;
  }

  .MuiInputBase-input {
    color: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)')};
  }

  /* Autofill styling */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${props => (props.$isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)')};
    -webkit-box-shadow: 0 0 0px 1000px ${props => (props.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)')} inset;
    box-shadow: 0 0 0px 1000px ${props => (props.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)')} inset;
  }
`;

// Botão com gradiente
export const GradientButton = styled.button`
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
      : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  width: 100%;
  margin: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.$isDark ? '0 8px 25px rgba(0, 255, 255, 0.4)' : '0 8px 25px rgba(0, 255, 255, 0.4)'};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  /* progress underline during loading */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 100%;
    bottom: 0;
    height: 3px;
    background: rgba(255,255,255,0.6);
    transition: right 1.2s ease;
  }
  &:disabled {
    &::after {
      right: 0; /* animate full width while disabled/loading */
    }
  }
`;

// Link estilizado
export const StyledLink = styled.a`
  color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 255, 0.8)')};
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => (props.$isDark ? 'rgba(0, 255, 255, 1)' : 'rgba(0, 255, 255, 1)')};
    text-decoration: underline;
  }
`;

// Credenciais de demo
export const DemoCredentials = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.05)' : 'rgba(0, 255, 255, 0.05)')};
  border: 1px solid
    ${props => (props.$isDark ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.2)')};
  border-radius: 8px;
  text-align: center;
`;

export const DemoText = styled.div`
  color: ${props => (props.$isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')};
  font-size: 0.875rem;
  line-height: 1.4;
`;
