/*
PC-Express - Sistema de Gerenciamento de Inventário
Copyright (c) 2024 Equipe Big 5

Desenvolvido por:
- Lucca Phelipe Masini RM 564121
- Luiz Henrique Poss RM 562177
- Luis Fernando de Oliveira Salgado RM 561401
- Igor Paixão Sarak RM 563726
- Bernardo Braga Perobeli RM 56246

PROPRIEDADE INTELECTUAL - NÃO COPIAR PARA TRABALHOS ACADÊMICOS
Trabalho acadêmico original - Uso apenas para referência e estudo
*/

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

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

// Page transition variants - Inspired by premium web experiences
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Animated Routes wrapper
const AnimatedRoutes = ({ darkMode, onToggleDarkMode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Login darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Register darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
            </motion.div>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Dashboard darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Products darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Suppliers darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase-orders"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <PurchaseOrders darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Insights darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Alerts darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auto-restock"
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <AutoRestock darkMode={darkMode} />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
              <AnimatedRoutes darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
            </Router>
          </TourProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
