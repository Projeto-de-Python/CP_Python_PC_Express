import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(email, password);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 450,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'rgba(26, 26, 46, 0.85)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(25px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 1,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 30px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Computer 
                sx={{ 
                  fontSize: 56, 
                  color: '#667eea',
                  filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.6))' : 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))',
                  animation: 'pulse 3s ease-in-out infinite',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                    filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.8))' : 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.5))',
                  },
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                    },
                  },
                }} 
              />
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: theme.palette.mode === 'dark' ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none',
                animation: 'gradientShift 4s ease-in-out infinite',
                '@keyframes gradientShift': {
                  '0%, 100%': {
                    backgroundPosition: '0% 50%',
                  },
                  '50%': {
                    backgroundPosition: '100% 50%',
                  },
                },
              }}
            >
              PC Express
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                fontWeight: 500,
                letterSpacing: '0.5px',
                marginTop: '0.5rem',
              }}
            >
              {t('auth.register')}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                background: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: theme.palette.mode === 'dark' ? '1px solid rgba(244, 67, 54, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Estilo comum para campos de texto */}
            <style>
              {`
                .modern-text-field .MuiOutlinedInput-root {
                  border-radius: 12px !important;
                  background: ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)'} !important;
                  border: 1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
                  transition: all 0.3s ease !important;
                }
                .modern-text-field .MuiOutlinedInput-root:hover {
                  background: ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)'} !important;
                  border-color: ${theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.3)'} !important;
                  transform: translateY(-1px) !important;
                  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15) !important;
                }
                .modern-text-field .MuiOutlinedInput-root.Mui-focused {
                  background: ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'} !important;
                  border-color: #667eea !important;
                  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                  transform: translateY(-2px) !important;
                }
                .modern-text-field .MuiInputLabel-root {
                  color: ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'} !important;
                  font-weight: 500 !important;
                }
                .modern-text-field .MuiInputLabel-root.Mui-focused {
                  color: #667eea !important;
                }
                .modern-text-field .MuiInputBase-input {
                  color: ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'} !important;
                  font-weight: 500 !important;
                }
              `}
            </style>
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
              onChange={(e) => setEmail(e.target.value)}
              className="modern-text-field"
              sx={{ mb: 3 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modern-text-field"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('auth.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="modern-text-field"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                borderRadius: 4,
                fontSize: '1.2rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundSize: '200% 200%',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundPosition: 'right center',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-3px) scale(1.02)',
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                },
                '&:disabled': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: 'none',
                  transform: 'none',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.registerButton')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  '&:hover': {
                    color: '#5a6fd8',
                    background: 'rgba(102, 126, 234, 0.1)',
                    textDecoration: 'none',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {t('auth.alreadyHaveAccount')}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
