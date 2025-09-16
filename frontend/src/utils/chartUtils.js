// Chart utilities and common functions
export const chartColors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#1dd1a1',
  warning: '#feca57',
  error: '#ff6b6b',
  info: '#48dbfb',
  chartColors: [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#f5576c',
    '#4facfe',
    '#00f2fe',
    '#43e97b',
    '#38f9d7',
    '#fa709a',
    '#fee140',
  ],
  gradientColors: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    error: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
  },
};

export const chartAnimation = {
  duration: 1000,
  easing: 'ease-in-out',
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
        backdropFilter: 'blur(10px)',
      };
    }
    return null;
  };

export const getChartTheme = darkMode => ({
  grid: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  text: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
  background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
});

export const formatCurrency = value => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = value => {
  return new Intl.NumberFormat('en-US').format(value);
};
