import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

function Header() {
  return (
    <header className="flex items-center justify-between bg-gray-800 px-8 py-4 shadow-lg">
      <nav className="flex gap-6 font-medium">
        <Link to="/main" className="text-lg text-gray-300 underline-offset-4 hover:text-white hover:underline">
          Main
        </Link>
        <Link to="/about" className="text-lg text-gray-300 underline-offset-4 hover:text-white hover:underline">
          About
        </Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}

export default Header;
