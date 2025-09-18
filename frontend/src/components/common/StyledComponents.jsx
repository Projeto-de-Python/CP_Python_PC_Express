import { Button, TextField, Card } from '@mui/material';
import styled from 'styled-components';

// Layout Components
export const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'center'};
  flex-direction: ${props => props.direction || 'row'};
  gap: ${props => props.gap || '0'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  padding: ${props => props.padding || '0'};
  margin: ${props => props.margin || '0'};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
  gap: ${props => props.gap || '1rem'};
  width: ${props => props.width || '100%'};
  padding: ${props => props.padding || '0'};
`;

// Card Components
export const StyledCard = styled(Card)`
  border-radius: 12px;
  background: ${props =>
    props.theme?.mode === 'dark' ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border: ${props =>
    props.theme?.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  box-shadow: ${props =>
    props.theme?.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.theme?.mode === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.4)'
        : '0 12px 40px rgba(0, 0, 0, 0.15)'};
  }
`;

// Button Components
export const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${props =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: none;
    transform: none;
  }
`;

export const OutlineButton = styled(Button)`
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

// Input Components
export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: ${props =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    transition: all 0.3s ease;

    &:hover {
      background: ${props =>
        props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    }

    &.Mui-focused {
      background: ${props =>
        props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }

  .MuiInputLabel-root {
    color: ${props =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

// Typography Components
export const GradientTitle = styled.h1`
  font-size: ${props => props.size || '2rem'};
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props =>
    props.theme?.mode === 'dark' ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none'};
`;

export const StyledText = styled.p`
  color: ${props =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  font-size: ${props => props.size || '1rem'};
  font-weight: ${props => props.weight || '400'};
  margin: ${props => props.margin || '0'};
  line-height: ${props => props.lineHeight || '1.5'};
`;

// Background Components
export const GradientBackground = styled.div`
  min-height: 100vh;
  background: ${props =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
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
      props.theme?.mode === 'dark'
        ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
  }
`;

// Animation Components
export const FadeInContainer = styled.div`
  opacity: 0;
  animation: fadeIn 0.6s ease-in-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SlideInContainer = styled.div`
  opacity: 0;
  animation: slideIn 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Utility Components
export const GlassContainer = styled.div`
  background: ${props =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: ${props =>
    props.theme?.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.borderRadius || '12px'};
  padding: ${props => props.padding || '1rem'};
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${props =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)'};
  margin: ${props => props.margin || '1rem 0'};
`;
