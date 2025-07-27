import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="flex justify-start bg-gray-800 shadow-lg">
      <nav className="flex gap-6 px-8 py-4 font-medium">
        <Link to="/main" className="text-lg text-gray-300 underline-offset-4 hover:text-white hover:underline">
          Main
        </Link>
        <Link to="/about" className="text-lg text-gray-300 underline-offset-4 hover:text-white hover:underline">
          About
        </Link>
      </nav>
    </header>
  );
}

export default Header;
