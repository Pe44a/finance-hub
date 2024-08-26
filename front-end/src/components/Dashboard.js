import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../utils/Auth';
import TransactionForm from './TransactionForm';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      console.error('Error response:', error.response);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!dashboardData) return <div>Failed to load dashboard data</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Balance</h3>
          <p className="text-2xl font-bold">${Number(dashboardData.balance).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
          <ul>
            {dashboardData.recent_transactions.map((transaction) => (
              <li key={transaction.id} className="mb-2">
                {transaction.description}: ${Math.abs(Number(transaction.amount)).toFixed(2)} ({transaction.type})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Monthly Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.monthly_stats.map((stat) => (
            <div key={`${stat.year}-${stat.month}`} className="bg-white p-4 rounded shadow">
              <h4>{new Date(stat.year, stat.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
              <p>Income: ${stat.income.toFixed(2)}</p>
              <p>Expense: ${stat.expense.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <TransactionForm onTransactionAdded={fetchData} />
    </div>
  );
};

export default Dashboard;