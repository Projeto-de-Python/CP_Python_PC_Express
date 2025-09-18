// Chart utilities and common functions
export const chartColors = {
  primary: '#4f46e5',
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  chartColors: [
    '#4f46e5',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ec4899'
  ],
  gradientColors: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    secondary: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    warning: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    error: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
  }
};

export const chartAnimation = {
  duration: 1000,
  easing: 'ease-in-out'
};

export const createCustomTooltip =
  darkMode =>
  ({ active, payload }) => {
    if (active && payload && payload.length) {
      return {
        background: darkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: '1px solid',
        borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderRadius: 1,
        padding: '12px',
        backdropFilter: 'blur(10px)'
      };
    }
    return null;
  };

export const getChartTheme = darkMode => ({
  grid: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  text: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
  background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
});

export const formatCurrency = value => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = value => {
  return new Intl.NumberFormat('en-US').format(value);
};
