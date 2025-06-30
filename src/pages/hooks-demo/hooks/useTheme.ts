import { useContext } from 'react';
import { ThemeContextType } from '../types';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  console.log('context', context);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
