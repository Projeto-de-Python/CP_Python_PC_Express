import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Alerts from './components/Alerts';
import AutoRestock from './components/AutoRestock';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Layout from './components/Layout';
import Products from './components/Products';
import PurchaseOrders from './components/PurchaseOrders';
import Suppliers from './components/Suppliers';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import SessionExpiredModal from './components/auth/SessionExpiredModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TourProvider } from './contexts/TourContext';
import './i18n';

// Componente wrapper para o modal de sessão expirada
const SessionExpiredModalWrapper = () => {
  const { sessionExpired, logout } = useAuth();

  return (
    <SessionExpiredModal
      open={sessionExpired}
      onClose={() => {}} // Não permite fechar manualmente
      onLogout={logout}
    />
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00ffff'
      },
      secondary: {
        main: '#8a2be2'
      },
      background: {
        default: darkMode ? '#0a0a0f' : '#f5f5f5',
        paper: darkMode ? '#0f0f1a' : '#ffffff'
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: darkMode ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode
              ? '1px solid rgba(0, 255, 255, 0.3)'
              : '1px solid rgba(0, 255, 255, 0.2)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: darkMode ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode
              ? '1px solid rgba(0, 255, 255, 0.3)'
              : '1px solid rgba(0, 255, 255, 0.2)'
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <AuthProvider>
          <TourProvider>
            <Router>
              <SessionExpiredModalWrapper />
              <Routes>
                {/* Public routes */}
                <Route
                  path="/login"
                  element={<Login darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />}
                />
                <Route
                  path="/register"
                  element={<Register darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />}
                />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <Dashboard darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <Products darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/suppliers"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <Suppliers darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/purchase-orders"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <PurchaseOrders darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/insights"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <Insights darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <Alerts darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />
                <Route
                  path="/auto-restock"
                  element={
                    <ProtectedRoute>
                      <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
                        <AutoRestock darkMode={darkMode} />
                      </Layout>
                    </ProtectedRoute>
                }
                />

                {/* Redirect any unknown routes to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </TourProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
