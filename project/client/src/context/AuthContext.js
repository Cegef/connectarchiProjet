import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const AuthContext = createContext(null);

// Fournisseur du contexte
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Fonction pour mettre à jour l'utilisateur et le token
  const setAuthData = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur backend :', errorData);
        throw new Error(errorData.error || 'Erreur lors de la connexion');
      }

      const data = await response.json();
      setAuthData(data); // Met à jour l'utilisateur et le token
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (email, password, name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const data = await response.json();
      setAuthData(data); // Met à jour l'utilisateur et le token
    } catch (error) {
      console.error('Erreur d\'inscription :', error);
      throw error;
    }
  };

  // Fonction pour définir le type d'utilisateur
  const setUserType = (type) => {
    if (user) {
      setUser({
        ...user,
        type,
        profileCompleted: false,
      });
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateUser = (data) => {
    if (user) {
      setUser({ ...user, ...data });
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, setUserType, logout, updateUser, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}