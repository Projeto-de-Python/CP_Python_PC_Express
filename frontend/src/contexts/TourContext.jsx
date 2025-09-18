import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const stopTour = () => {
    setIsTourOpen(false);
    // Marcar o tour como concluído no localStorage
    localStorage.setItem('pcExpressTourCompleted', 'true');
  };

  const value = {
    isTourOpen,
    startTour,
    stopTour
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};
