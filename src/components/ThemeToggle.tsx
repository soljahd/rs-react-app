import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={`relative h-8 w-14 cursor-pointer rounded-full bg-gray-600 transition-colors duration-300`}
    >
      <img src="./sun.svg" alt="sun" className={`absolute top-1/2 left-1 h-6 w-6 -translate-y-1/2`} />
      <img src="./moon.svg" alt="moon" className={`absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2`} />
      <div className="absolute top-1 left-1 h-6 w-6 translate-x-6 transform rounded-full bg-gray-100 transition-transform duration-300 dark:translate-x-0" />
    </div>
  );
};
