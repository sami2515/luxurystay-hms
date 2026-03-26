import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('luxury_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('luxury_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      // We don't auto-login after register strictly, but we can if desired. We will return data.
      return response.data;
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxury_user');
    toast.success('Session securely terminated', { icon: '🔒' });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
