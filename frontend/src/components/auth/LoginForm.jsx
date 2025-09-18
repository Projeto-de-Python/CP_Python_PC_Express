import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import {
    DemoCredentials,
    DemoText,
    GradientButton,
    StyledLink,
    StyledTextField
} from './LoginStyles';

const LoginForm = ({ isDark, onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            background: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            border: isDark
              ? '1px solid rgba(244, 67, 54, 0.3)'
              : '1px solid rgba(244, 67, 54, 0.3)'
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '8px' }}>
        <StyledTextField $isDark={isDark}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.email')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </StyledTextField>

        <StyledTextField $isDark={isDark}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)',
                      '&:hover': {
                        color: isDark ? 'rgba(0, 255, 255, 0.9)' : 'rgba(0, 255, 255, 0.8)',
                        backgroundColor: isDark
                          ? 'rgba(0, 255, 255, 0.15)'
                          : 'rgba(0, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </StyledTextField>

        <GradientButton
          type="submit"
          disabled={loading}
          $isDark={isDark}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.loginButton')}
        </GradientButton>

        <div style={{ textAlign: 'center' }}>
          <StyledLink as={RouterLink} to="/register" $isDark={isDark}>
            {t('auth.dontHaveAccount')}
          </StyledLink>
        </div>
      </form>

      <DemoCredentials $isDark={isDark}>
        <DemoText $isDark={isDark}>
          <strong>Demo Credentials:</strong>
          <br />
          Email: admin@pc-express.com
          <br />
          Password: admin123
        </DemoText>
      </DemoCredentials>
    </>
  );
};

LoginForm.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default LoginForm;
