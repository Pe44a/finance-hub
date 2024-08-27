import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkAuth } from '../utils/Auth'; // Import checkAuth

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">Welcome to Finance-hub</h1>
        <p className="text-xl mb-8 text-muted-foreground">Take control of your finances with our easy-to-use tracking tools.</p>
        {!isAuthenticated && (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Login
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;