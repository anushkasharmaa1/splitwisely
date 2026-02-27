'use client';

import { useEffect, useState } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  paidBy: { name: string | null; email: string };
  group: { name: string };
  userShare: number;
  userOwes: number;
  userLent: number;
}

type Category = 'All Activities' | 'Food' | 'Shopping' | 'Travel' | 'Housing';

export default function RecentActivityPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Activities');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data.expenses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories: Category[] = ['All Activities', 'Food', 'Shopping', 'Travel', 'Housing'];

  const filteredExpenses =
    selectedCategory === 'All Activities'
      ? expenses
      : expenses.filter(e => e.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: '🍔',
      Travel: '✈️',
      Housing: '🏠',
      Transport: '🚗',
      Shopping: '🛍️',
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recent Activity</h1>
        <p className="text-gray-400">Track all expense activity across your groups.</p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-[#1a2738] text-gray-400 hover:bg-[#1f2d40] border border-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-[#1a2738] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0d1726] rounded-lg flex items-center justify-center text-2xl">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{expense.description}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(expense.createdAt).toLocaleDateString()} · Paid by {expense.paidBy.name || expense.paidBy.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${
                      expense.userLent > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {expense.userLent > 0 ? 'You lent +' : 'You owe '}₹
                    {(expense.userLent || expense.userOwes).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1a2738] rounded-xl p-16 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg mb-2">No recent activity</p>
            <p className="text-gray-500 text-sm mb-6">
              {selectedCategory !== 'All Activities'
                ? `No activities in ${selectedCategory} category`
                : 'Start adding expenses to see activity here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}