import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import LoginBackground from './LoginBackground';
import LoginCard from './LoginCard';
import LoginLeftPanel from './LoginLeftPanel';
import { LoginWrapper, RightPanel } from './LoginStyles';
import TeamMembers from './TeamMembers';

const Login = ({ onToggleDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async(email, password) => {
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
    <LoginBackground isDark={isDark}>
      <TeamMembers isDark={isDark} />
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
  onToggleDarkMode: PropTypes.func.isRequired
};

export default Login;
