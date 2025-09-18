import React from 'react';

import Joyride from 'react-joyride';

import { useTour } from '../../contexts/TourContext';
import { steps } from './tourSteps';

const AppTour = () => {
  const { isTourOpen, stopTour } = useTour();

  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if (status === 'finished' || status === 'skipped') {
      stopTour();
    }
  };

  return (
    <Joyride
      run={isTourOpen}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#00ffff', // Ciano
          textColor: '#FFFFFF', // Branco
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo escuro com baixa opacidade
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          arrowColor: 'rgba(0, 0, 0, 0.8)',
          width: 320,
          zIndex: 10000
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: 12,
          color: '#FFFFFF',
          fontSize: 14,
          padding: 20,
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        tooltipTitle: {
          color: '#00ffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        tooltipContent: {
          color: '#FFFFFF',
          fontSize: 14,
          lineHeight: 1.5,
          marginBottom: 15,
        },
        tooltipFooter: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 15,
        },
        buttonNext: {
          backgroundColor: '#00ffff',
          color: '#000000',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#00cccc',
            transform: 'translateY(-1px)',
          },
        },
        buttonBack: {
          color: '#00ffff',
          marginRight: 10,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#00cccc',
          },
        },
        buttonSkip: {
          color: '#FFFFFF',
          fontSize: 14,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#00ffff',
          },
        },
        buttonClose: {
          color: '#FFFFFF',
          fontSize: 18,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#00ffff',
          },
        },
        beacon: {
          inner: '#00ffff',
          outer: '#00ffff',
        },
        beaconInner: {
          backgroundColor: '#00ffff',
        },
        beaconOuter: {
          backgroundColor: '#00ffff',
          opacity: 0.3,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          mixBlendMode: 'normal',
        },
        spotlight: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      }}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular tour',
      }}
    />
  );
};

export default AppTour;
