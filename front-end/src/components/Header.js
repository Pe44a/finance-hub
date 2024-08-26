import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/Auth';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-background text-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Finance-hub</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const MountainIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

export default Header;