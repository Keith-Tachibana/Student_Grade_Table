import React from 'react';
import Toggle from 'react-toggle';
import { useColorScheme } from '../../hooks/useColorScheme';

const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();
  return (
    <Toggle
      className="react-toggle"
      checked={isDark}
      onChange={(event) => setIsDark(event.target.checked)}
      icons={{ checked: '🌙', unchecked: '☀️' }}
      aria-label="Toggle dark mode"
    />
  );
};

export default DarkModeToggle;
