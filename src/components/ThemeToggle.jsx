import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg 
        bg-dark-700 dark:bg-dark-600 light:bg-light-200
        border border-dark-600 dark:border-dark-500 light:border-light-300
        hover:bg-dark-600 dark:hover:bg-dark-500 light:hover:bg-light-300
        transition-all duration-200 group
        ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon - visible in light mode */}
      <Sun
        size={20}
        className={`absolute text-yellow-500 transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-0 scale-0 rotate-180' 
            : 'opacity-100 scale-100 rotate-0'
        }`}
      />
      
      {/* Moon Icon - visible in dark mode */}
      <Moon
        size={20}
        className={`absolute text-blue-400 transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-100 scale-100 rotate-0' 
            : 'opacity-0 scale-0 rotate-180'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
