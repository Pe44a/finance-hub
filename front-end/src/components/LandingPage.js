import React from 'react';

const LandingPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Finance-hub</h1>
      <p className="mb-4">Track your income and expenses with ease.</p>
      <ul className="list-disc list-inside text-left max-w-md mx-auto">
        <li>Register and login securely</li>
        <li>View your financial dashboard</li>
        <li>Add and manage transactions</li>
        <li>Analyze your monthly statistics</li>
      </ul>
    </div>
  );
};

export default LandingPage;