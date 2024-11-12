"use client"

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define types for the context value
interface AuthContextType {
  isAuth: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  login: (request: RequestInit) => Promise<boolean>;
  get_info: (request: RequestInit) => Promise<void>;
  logout: (request: RequestInit) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Check authentication status on app load or refresh
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/status', {
        method: 'GET',
        credentials: 'include',  // Ensure cookies are included in the request
      });
      const data = await response.json();
      setIsAuth(data.isAuth);  // Update the auth state based on server response
    } catch (error) {
      console.error('Error checking authentication status', error);
    }
  };

  const login = async (request: RequestInit) => {
    try {
      const response = await fetch('http://localhost:4000/login', request);
      const data = await response.json();

      if (response.ok) {
        setIsAuth(true);  // Update authentication state
        console.log(data.message);  // Optionally handle the response
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in', error);
      return false;
      }
  }

  const get_info = async (request: RequestInit) => {
    try {
      const response = await fetch('http://localhost:4000/api/user', request);
      const data = await response.json();

      if (response.ok) {
        setEmail(data.email)
        setPassword(data.password)
        setFirstName(data.firstName)
        setLastName(data.lastName)
      }
    } catch (error) {
      console.error('Error finding user info', error);
    }
  };

  const logout = async (request: RequestInit) => {
    try {
      const response = await fetch('http://localhost:4000/logout', request);
      const data = await response.json();

      if (response.ok) {
        setIsAuth(false);  // Update authentication state
        console.log(data.message);  // Optionally handle the response
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging out', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, email, password, firstName, lastName,
                                   login, get_info, logout }}>
      {children}
    </AuthContext.Provider>
  );
};