import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

function Header() {
  const location = useLocation();
  const isMainPage = location.pathname === '/main';
  const isAboutPage = location.pathname === '/about';

  return (
    <header className="flex items-center justify-between bg-gray-100 px-8 py-4 shadow-md transition-colors duration-200 dark:bg-gray-800">
      <nav className="flex gap-8 font-medium">
        {isMainPage ? (
          <span className="cursor-default text-lg text-gray-700 dark:text-gray-300">Main</span>
        ) : (
          <Link
            to="/main"
            className="text-lg text-gray-700 underline-offset-4 transition-colors duration-200 hover:text-blue-600 hover:underline dark:text-gray-300 dark:hover:text-blue-400"
          >
            Main
          </Link>
        )}
        {isAboutPage ? (
          <span className="cursor-default text-lg text-gray-700 dark:text-gray-300">About</span>
        ) : (
          <Link
            to="/about"
            className="text-lg text-gray-700 underline-offset-4 transition-colors duration-200 hover:text-blue-600 hover:underline dark:text-gray-300 dark:hover:text-blue-400"
          >
            About
          </Link>
        )}
      </nav>
      <ThemeToggle />
    </header>
  );
}

export default Header;
