'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  paidBy: {
    id: string;
    name: string | null;
    email: string;
  };
  group: {
    id: string;
    name: string;
  };
  userShare: number;
  userOwes: number;
  userLent: number;
  settled: boolean;
};

export default function AllExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch expenses');
      }

      setExpenses(data.expenses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Settle expense
  const settleExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}/settle`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to settle expense');
      }

      fetchExpenses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🗑️ Delete expense
  const deleteExpense = async (expenseId: string) => {
    const confirmed = confirm('Delete this expense?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete expense');
      }

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'All') return true;
    if (filter === 'Dining') return expense.category === 'Food';
    if (filter === 'Groceries') return expense.category === 'Shopping';
    if (filter === 'Travel') return expense.category === 'Travel';
    if (filter === 'Utilities') return expense.category === 'Housing';
    return true;
  });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Expenses</h1>
          <p className="text-gray-400 mt-1">
            View and manage all your shared expenses.
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
        >
          + Add Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        {['All', 'Dining', 'Groceries', 'Travel', 'Utilities'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === cat
                ? 'bg-blue-500 text-white'
                : 'bg-[#1a2738] text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-400">
          Loading expenses...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && filteredExpenses.length > 0 && (
        <div className="space-y-4">
          {filteredExpenses.map(expense => (
            <div
              key={expense.id}
              className="p-6 bg-[#1a2738] border border-gray-700 rounded-lg"
            >
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                    {getCategoryIcon(expense.category)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {expense.description}
                    </h3>
                    <div className="text-sm text-gray-400">
                      {expense.group.name} • Paid by{' '}
                      {expense.paidBy.name || expense.paidBy.email} •{' '}
                      {formatDate(expense.createdAt)}
                    </div>

                    <div className="mt-2 text-sm">
                      {expense.userLent > 0 ? (
                        <span className="text-green-400">
                          You lent +₹{expense.userLent.toFixed(2)}
                        </span>
                      ) : expense.userOwes > 0 ? (
                        <span className="text-red-400">
                          You owe ₹{expense.userOwes.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Your share: ₹{expense.userShare.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-semibold">
                    ₹{expense.amount.toFixed(2)}
                  </div>

                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        expense.settled
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {expense.settled ? 'Settled' : 'Pending'}
                    </span>

                    {!expense.settled && (
                      <button
                        onClick={() => settleExpense(expense.id)}
                        className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400"
                      >
                        Settle Up
                      </button>
                    )}

                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-400 hover:text-red-500"
                      title="Delete expense"
                    >
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




