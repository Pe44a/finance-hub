import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ onTransactionAdded }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const date = new Date();
      await axios.post('/api/transactions', 
        { amount, description, date, type },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAmount('');
      setDescription('');
      setType('expense');
      onTransactionAdded();
    } catch (error) {
      console.error('Failed to add transaction', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;