import { Computer } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoginForm from './LoginForm';
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
