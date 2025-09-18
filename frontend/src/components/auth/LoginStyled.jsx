import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Computer } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../../contexts/AuthContext';


// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.theme.mode === 'dark'
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
      props.theme.mode === 'dark'
        ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
  }
`;

const LoginCard = styled.div`
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border: ${props =>
    props.theme.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)'};
  position: relative;
  z-index: 1;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LogoIcon = styled(Computer)`
  font-size: 48px;
  color: #667eea;
  filter: ${props =>
    props.theme.mode === 'dark' ? 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.5))' : 'none'};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props =>
    props.theme.mode === 'dark' ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none'};
`;

const Subtitle = styled.h6`
  color: ${props =>
    props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  font-weight: 400;
  margin: 0.5rem 0 0 0;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;

  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: ${props =>
      props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};

    &:hover {
      background: ${props =>
        props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    }

    &.Mui-focused {
      background: ${props =>
        props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
    }
  }

  .MuiInputLabel-root {
    color: ${props =>
      props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const GradientButton = styled(Button)`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${props =>
      props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: none;
    transform: none;
  }
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #5a6fd8;
  }
`;

const DemoCredentials = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)'};
  border: ${props =>
    props.theme.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(102, 126, 234, 0.1)'};
`;

const DemoText = styled.p`
  color: ${props =>
    props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  text-align: center;
  font-weight: 500;
  margin: 0;

  strong {
    color: #667eea;
  }
`;

const LoginStyled = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock theme for styled-components
  const theme = {
    mode: 'light' // Você pode integrar com o tema do MUI
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <LoginContainer theme={theme}>
        <LoginCard theme={theme}>
          <LogoSection>
            <LogoContainer>
              <LogoIcon theme={theme} />
            </LogoContainer>
            <Title theme={theme}>PC Express</Title>
            <Subtitle theme={theme}>{t('auth.login')}</Subtitle>
          </LogoSection>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background:
                  theme.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border:
                  theme.mode === 'dark'
                    ? '1px solid rgba(244, 67, 54, 0.3)'
                    : '1px solid rgba(244, 67, 54, 0.3)'
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <StyledTextField
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              theme={theme}
            />
            <StyledTextField
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              theme={theme}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{
                        color:
                          theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <GradientButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              theme={theme}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.loginButton')}
            </GradientButton>

            <div style={{ textAlign: 'center' }}>
              <StyledLink component={RouterLink} to="/register" variant="body2" theme={theme}>
                {t('auth.dontHaveAccount')}
              </StyledLink>
            </div>
          </form>

          <DemoCredentials theme={theme}>
            <DemoText theme={theme}>
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

export default LoginStyled;
