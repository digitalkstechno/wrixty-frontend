"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthenticatedUser, setAuthenticatedUser } from '../utils/authUtils';
import api from '../services/api';

interface ThemeContextType {
  themeColor: string;
  darkMode: boolean;
  changeThemeColor: (color: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState('#0F766E'); // Default Teal
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load initial theme from authenticated user
    const user = getAuthenticatedUser();
    if (user) {
      if (user.themeColor) setThemeColor(user.themeColor);
      if (user.darkMode !== undefined) setDarkMode(user.darkMode);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Apply primary color
    root.style.setProperty('--primary', themeColor);
    root.style.setProperty('--color-primary-teal', themeColor);
    
    // Update gradients
    root.style.setProperty('--image-gradient-primary', `linear-gradient(135deg, ${themeColor} 0%, #06B6D4 100%)`);
    root.style.setProperty('--image-gradient-surface', `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${themeColor}08 100%)`);
    root.style.setProperty('--image-gradient-subtle', `linear-gradient(135deg, ${themeColor}0D 0%, rgba(6, 182, 212, 0.05) 100%)`);

    if (darkMode) {
      root.style.setProperty('--background', '#0F172A');
      root.style.setProperty('--foreground', '#F8FAFC');
      root.style.setProperty('--card', '#1E293B');
      root.style.setProperty('--border', '#334155');
      root.style.setProperty('--muted', '#94A3B8');
      root.style.setProperty('--muted-bg', '#0F172A');
      // Fix specific text colors for dark mode
      root.style.setProperty('--color-text-primary', '#F8FAFC');
      root.style.setProperty('--color-text-secondary', '#94A3B8');
      document.body.style.color = '#F8FAFC';
      root.classList.add('dark');
    } else {
      root.style.setProperty('--background', '#FFFFFF');
      root.style.setProperty('--foreground', '#0F172A');
      root.style.setProperty('--card', '#FFFFFF');
      root.style.setProperty('--border', '#E2E8F0');
      root.style.setProperty('--muted', '#64748B');
      root.style.setProperty('--muted-bg', '#F8FAFC');
      // Fix specific text colors for light mode
      root.style.setProperty('--color-text-primary', '#0F172A');
      root.style.setProperty('--color-text-secondary', '#64748B');
      document.body.style.color = '#1f2f3e';
      root.classList.remove('dark');
    }
  }, [themeColor, darkMode]);

  const saveThemeToBackend = async (newColor: string, isDark: boolean) => {
    const user = getAuthenticatedUser();
    if (user && (user._id || user.id)) {
      try {
        const userId = user._id || user.id;
        await api.put(`/users/${userId}`, {
          themeColor: newColor,
          darkMode: isDark
        });
        
        // Update local storage
        user.themeColor = newColor;
        user.darkMode = isDark;
        setAuthenticatedUser(user);
      } catch (err) {
        console.error("Failed to save theme preferences to backend", err);
      }
    }
  };

  const changeThemeColor = (color: string) => {
    setThemeColor(color);
    saveThemeToBackend(color, darkMode);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveThemeToBackend(themeColor, newMode);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, darkMode, changeThemeColor, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
