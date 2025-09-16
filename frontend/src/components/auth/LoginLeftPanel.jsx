import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { Dashboard, Psychology, Smartphone, Notifications } from '@mui/icons-material';
import { Computer } from 'lucide-react';
import { LeftPanel, HoverEffect } from './LoginStyles';

const LoginLeftPanel = ({ isDark }) => {
  const [isLeftHovered, setIsLeftHovered] = useState(false);

  const features = [
    {
      icon: <Dashboard />,
      title: 'Dashboard Inteligente',
      description: 'Visão completa do seu negócio em tempo real',
    },
    {
      icon: <Psychology />,
      title: 'IA e Machine Learning',
      description: 'Previsões de demanda e otimização de preços',
    },
    {
      icon: <Smartphone />,
      title: 'Responsivo',
      description: 'Funciona perfeitamente em qualquer dispositivo',
    },
    {
      icon: <Notifications />,
      title: 'Alertas Inteligentes',
      description: 'Notificações automáticas para estoque baixo',
    },
  ];

  return (
    <LeftPanel
      onMouseEnter={() => setIsLeftHovered(true)}
      onMouseLeave={() => setIsLeftHovered(false)}
    >
      <HoverEffect $isDark={isDark} $isHovered={isLeftHovered} />

      {/* Logo principal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            background: isDark
              ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
              : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 255, 255, 0.3)'
              : '0 8px 32px rgba(0, 255, 255, 0.3)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <Computer size={60} color="white" />
        </div>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
              : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          PC Express
        </Typography>

        <Typography
          variant="h6"
          style={{
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            fontWeight: 400,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          Sistema de Gestão de Estoque Inteligente
        </Typography>
      </div>

      {/* Lista de recursos */}
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: '15px',
              border: isDark
                ? '1px solid rgba(0, 255, 255, 0.1)'
                : '1px solid rgba(0, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(10px)';
              e.currentTarget.style.background = isDark
                ? 'rgba(0, 255, 255, 0.1)'
                : 'rgba(0, 255, 255, 0.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)';
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                background: isDark
                  ? 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)'
                  : 'linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: 'white',
              }}
            >
              {feature.icon}
            </div>

            <div>
              <Typography
                variant="h6"
                style={{
                  color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
              >
                {feature.title}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  lineHeight: 1.4,
                }}
              >
                {feature.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </LeftPanel>
  );
};

LoginLeftPanel.propTypes = {
  isDark: PropTypes.bool.isRequired,
};

export default LoginLeftPanel;
