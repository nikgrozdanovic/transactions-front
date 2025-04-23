import React, { useEffect, useState } from 'react';

export type TransactionStatus = 'pending' | 'complete';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  status: TransactionStatus;
}

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(
        `http://localhost:3000/transaction?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(
    (t) =>
      (filterCategory ? t.category === filterCategory : true) &&
      (filterStatus ? t.status === filterStatus : true)
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Transaction Manager</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value=''>All Categories</option>
          <option value='Food'>Food</option>
          <option value='Utilities'>Utilities</option>
          <option value='Transport'>Transport</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value=''>All Statuses</option>
          <option value='pending'>Pending</option>
          <option value='completed'>Completed</option>
        </select>
      </div>

      {loading && <p>Loading transactions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              Amount
            </th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              Category
            </th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              Status
            </th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                ${t.amount.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {t.category}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {t.status}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
