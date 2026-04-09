'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Expense = {
  id: string;
  description: string;
  amount: number | null;
  category: string;
  createdAt: string;
  paidBy: { id: string; name: string | null; email: string };
  group: { id: string; name: string };
  userShare: number | null;
  userOwes: number | null;
  userLent: number | null;
  settled: boolean;
};

export default function AllExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch expenses');
      setExpenses(data.expenses || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const settleExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}/settle`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to settle expense');
      fetchExpenses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete expense');
      fetchExpenses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food': return '🍔';
      case 'Travel': return '✈️';
      case 'Housing': return '🏠';
      case 'Transport': return '🚗';
      case 'Shopping': return '🛍️';
      default: return '📌';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const safeAmount = (value: number | null | undefined) => Number(value ?? 0).toFixed(2);

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'All') return true;
    if (filter === 'Dining') return expense.category === 'Food';
    if (filter === 'Groceries') return expense.category === 'Shopping';
    if (filter === 'Travel') return expense.category === 'Travel';
    if (filter === 'Utilities') return expense.category === 'Housing';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage all your shared expenses.</p>
        </div>
        <Link
          href="/expenses/new"
          className="flex items-center justify-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition text-sm whitespace-nowrap"
        >
          + Add Expense
        </Link>
      </div>

      {/* Filters - scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['All', 'Dining', 'Groceries', 'Travel', 'Utilities'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition text-sm whitespace-nowrap flex-shrink-0 ${
              filter === cat ? 'bg-blue-500 text-white' : 'bg-[#1a2738] text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-12 text-gray-400">Loading expenses...</div>}
      {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 mb-6">{error}</div>}

      {!loading && !error && filteredExpenses.length > 0 && (
        <div className="space-y-3">
          {filteredExpenses.map(expense => (
            <div key={expense.id} className="p-4 bg-[#1a2738] border border-gray-700 rounded-lg">
              <div className="flex gap-3">
                <div className="w-10 h-10 flex-shrink-0 bg-blue-500 rounded-lg flex items-center justify-center text-xl">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold truncate">{expense.description}</h3>
                    <span className="text-base font-semibold flex-shrink-0">₹{safeAmount(expense.amount)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {expense.group.name} · Paid by {expense.paidBy.name || expense.paidBy.email} · {formatDate(expense.createdAt)}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {expense.userLent && expense.userLent > 0 ? (
                      <span className="text-xs text-green-400">You lent +₹{safeAmount(expense.userLent)}</span>
                    ) : expense.userOwes && expense.userOwes > 0 ? (
                      <span className="text-xs text-red-400">You owe ₹{safeAmount(expense.userOwes)}</span>
                    ) : (
                      <span className="text-xs text-gray-400">Your share: ₹{safeAmount(expense.userShare)}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${expense.settled ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {expense.settled ? 'Settled' : 'Pending'}
                    </span>
                    {!expense.settled && (
                      <button onClick={() => settleExpense(expense.id)} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        Settle Up
                      </button>
                    )}
                    <button onClick={() => deleteExpense(expense.id)} className="text-red-400 hover:text-red-500 text-xs ml-auto">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}