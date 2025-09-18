import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { api } from '../services/api';
import {
  clearAuthData,
  detectHardRefresh,
  getAuthToken,
  getUserData,
  isSessionValid,
  saveAuthToken,
  saveUserData,
  startActivityMonitor,
  updateLastActivity
} from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia como true para verificar sessão
  const [sessionExpired, setSessionExpired] = useState(false);
  const logoutRef = useRef();

  // Verificar sessão existente ao inicializar
  useEffect(() => {
    const initializeAuth = async() => {
      try {
        setLoading(true);

        // Verifica se é um refresh forçado (agora mais permissivo)
        if (detectHardRefresh()) {
          clearAuthData();
          setLoading(false);
          return;
        }

        // Verifica se há token e se a sessão é válida
        const existingToken = getAuthToken();
        const existingUser = getUserData();

        if (existingToken && isSessionValid() && existingUser) {
          setToken(existingToken);
          setUser(existingUser);
          updateLastActivity();
        } else {
          // Sessão inválida ou expirada, limpa dados
          clearAuthData();
        }
      } catch {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = useCallback(async() => {
    try {
      // Limpa todos os dados de autenticação
      clearAuthData();

      // Limpa o estado
      setToken(null);
      setUser(null);
      setSessionExpired(false);
    } catch {
      // Erro durante logout - silencioso
    }
  }, []);

  // Atualiza a ref sempre que logout mudar
  logoutRef.current = logout;

  // Configurar interceptors do axios (apenas uma vez)
  useEffect(() => {
    // Limpar interceptors existentes para evitar duplicação
    api.interceptors.request.clear();
    api.interceptors.response.clear();

    const requestInterceptor = api.interceptors.request.use(
      config => {
        const currentToken = getAuthToken();
        console.log('🔑 Request interceptor - Token:', currentToken ? 'EXISTS' : 'MISSING');
        console.log('🔑 Request interceptor - URL:', config.url);
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
          console.log('🔑 Request interceptor - Authorization header set');
        } else {
          console.log('❌ Request interceptor - No token found');
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      response => {
        // Atualiza atividade em cada requisição bem-sucedida
        updateLastActivity();
        return response;
      },
      async error => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          await logoutRef.current();
        }
        return Promise.reject(error);
      }
    );

    // Interceptor de retry automático
    const retryInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const config = error.config;

        // Se não há config ou já tentou 3 vezes, rejeita
        if (!config || config.__retryCount >= 3) {
          return Promise.reject(error);
        }

        // Não fazer retry para erros 401 (autenticação)
        if (error.response?.status === 401) {
          return Promise.reject(error);
        }

        // Incrementa contador de tentativas
        config.__retryCount = config.__retryCount || 0;
        config.__retryCount += 1;

        // Aguarda antes de tentar novamente (backoff exponencial)
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        return api(config);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
      api.interceptors.response.eject(retryInterceptor);
    };
  }, []); // Sem dependências para evitar recriação

  // Monitor de atividade para manter sessão ativa
  useEffect(() => {
    if (token && user) {
      const cleanup = startActivityMonitor(() => {
        setSessionExpired(true);
        logout();
      });

      return cleanup;
    }
  }, [token, user, logout]);

  const login = useCallback(async(email, password) => {
    try {
      setLoading(true);
      setSessionExpired(false);

      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token } = response.data;

      // Salva token usando o novo sistema de cookies
      const tokenSaved = saveAuthToken(access_token, refresh_token);
      if (!tokenSaved) {
        throw new Error('Falha ao salvar token');
      }

      setToken(access_token);

      // Salva dados do usuário
      const userData = {
        email,
        loginTime: Date.now()
      };
      saveUserData(userData);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async(email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        email,
        password
      });

      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    sessionExpired,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
