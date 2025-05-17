import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://quado-task-manager-backend.onrender.com/api',
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await api.post('/auth/refresh', { refreshToken });
          
          localStorage.setItem('token', res.data.token);
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
          
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  });

  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [auth.token]);
  
  useEffect(() => {
    const validateToken = async () => {
      if (auth.token) {
        try {
          await api.get('/auth/validate');
        } catch (err) {
          logout();
        }
      }
    };
    
    validateToken();
  }, []);

  const register = useCallback(async (userData) => {
    let isMounted = true;
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));
      
      const res = await api.post('/auth/register', userData);
      
      if (isMounted) {
        localStorage.setItem('token', res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        const safeUserData = {
          id: res.data.user.id,
          username: res.data.user.username,
          email: res.data.user.email,
        };
        localStorage.setItem('user', JSON.stringify(safeUserData));
        
        setAuth((prev) => ({
          ...prev,
          user: safeUserData,
          token: res.data.token,
          refreshToken: res.data.refreshToken || null,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      }
      
      return true;
    } catch (err) {
      if (isMounted) {
        setAuth((prev) => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || 'Registration failed. Please try again.'
        }));
      }
      return false;
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (userData) => {
    let isMounted = true;
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));
      
      const res = await api.post('/auth/login', userData);
      
      if (isMounted) {
        localStorage.setItem('token', res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        
        const safeUserData = {
          id: res.data.user.id,
          username: res.data.user.username,
          email: res.data.user.email,
        };
        localStorage.setItem('user', JSON.stringify(safeUserData));
        
        setAuth((prev) => ({
          ...prev,
          user: safeUserData,
          token: res.data.token,
          refreshToken: res.data.refreshToken || null,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      }
      
      return true;
    } catch (err) {
      if (isMounted) {
        setAuth((prev) => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || 'Invalid credentials. Please try again.'
        }));
      }
      return false;
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      if (auth.token) {
        await api.post('/auth/logout').catch(() => {
        });
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setAuth({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  }, [auth.token]);

  const clearErrors = useCallback(() => {
    setAuth((prev) => ({ ...prev, error: null }));
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));
      
      const res = await api.put('/user/profile', userData);
      
      const updatedUser = {
        ...auth.user,
        ...res.data.user,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setAuth((prev) => ({
        ...prev,
        user: updatedUser,
        loading: false,
        error: null
      }));
      
      return true;
    } catch (err) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to update profile'
      }));
      return false;
    }
  }, [auth.user]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        register,
        login,
        logout,
        clearErrors,
        updateUser,
        isLoading: auth.loading,
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        error: auth.error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { api };