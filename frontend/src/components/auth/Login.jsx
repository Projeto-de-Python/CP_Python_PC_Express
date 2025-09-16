import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginBackground from './LoginBackground';
import LoginLeftPanel from './LoginLeftPanel';
import LoginCard from './LoginCard';
import { LoginWrapper, RightPanel } from './LoginStyles';

const Login = ({ onToggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (email, password) => {
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

  const isDark = theme.palette.mode === 'dark';

  return (
    <LoginBackground isDark={isDark} onToggleDarkMode={onToggleDarkMode}>
      <LoginWrapper>
        <LoginLeftPanel isDark={isDark} />

        <RightPanel>
          <LoginCard isDark={isDark} onSubmit={handleSubmit} loading={loading} error={error} />
        </RightPanel>
      </LoginWrapper>
    </LoginBackground>
  );
};

Login.propTypes = {
  onToggleDarkMode: PropTypes.func.isRequired,
};

export default Login;
