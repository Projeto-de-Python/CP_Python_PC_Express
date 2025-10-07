import { Computer } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoginForm from './LoginForm';
import { motion } from 'framer-motion';
import {
    FormComputer,
    FormLogoContainer,
    GradientTitle,
    HoverEffect,
    LogoSection,
    LoginCard as StyledLoginCard,
    SubTitle
} from './LoginStyles';

const LoginCard = ({ isDark, onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [isRightHovered, setIsRightHovered] = useState(false);

  return (
    <StyledLoginCard
      as={motion.div}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5 }}
      $isDark={isDark}
      onMouseEnter={() => setIsRightHovered(true)}
      onMouseLeave={() => setIsRightHovered(false)}
    >
      <HoverEffect $isDark={isDark} $isHovered={isRightHovered} />

      <LogoSection>
        <FormLogoContainer>
          <FormComputer $isDark={isDark}>
            <Computer size={30} color="white" />
          </FormComputer>
        </FormLogoContainer>

        <GradientTitle $isDark={isDark}>
          Bem-vindo de volta
        </GradientTitle>

        <SubTitle $isDark={isDark}>
          {t('auth.login')}
        </SubTitle>
      </LogoSection>

      <LoginForm isDark={isDark} onSubmit={onSubmit} loading={loading} error={error} />
    </StyledLoginCard>
  );
};

LoginCard.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default LoginCard;
