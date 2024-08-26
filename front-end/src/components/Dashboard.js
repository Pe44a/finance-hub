import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../utils/Auth';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (isLoading) return <div>Loading...</div>;
  if (!dashboardData) return <div>Failed to load dashboard data</div>;

  return (
    <div className="grid gap-6 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-2xl font-bold">${Number(dashboardData.balance).toFixed(2)}</h3>
          <p>Current Balance</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-2xl font-bold">${dashboardData.monthly_stats[0].income.toFixed(2)}</h3>
          <p>Total Income</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-2xl font-bold">${dashboardData.monthly_stats[0].expense.toFixed(2)}</h3>
          <p>Total Expenses</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 text-lg">Date</th>
                  <th className="text-left py-2 text-lg">Description</th>
                  <th className="text-left py-2 text-lg">Amount</th>
                  <th className="text-left py-2 text-lg">Type</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t">
                    <td className="py-2 text-base">{formatDate(transaction.date)}</td>
                    <td className="py-2 text-base">{transaction.description}</td>
                    <td className={`py-2 text-base ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      ${Math.abs(Number(transaction.amount)).toFixed(2)}
                    </td>
                    <td className="py-2 text-base capitalize">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Monthly Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.monthly_stats}>
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return months[parseInt(value) - 1] || value;
                }} 
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4CAF50" name="Income" />
              <Bar dataKey="expense" fill="#F44336" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <TransactionForm onTransactionAdded={fetchData} />
    </div>
  );
};

export default Dashboard;