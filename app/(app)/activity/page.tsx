'use client';

import { useState } from 'react';

type Category = 'All Activities' | 'Dining' | 'Groceries' | 'Travel' | 'Utilities';

interface Activity {
  id: string;
  title: string;
  date: string;
  paidBy: string;
  amount: number;
  type: 'lent' | 'owe';
  category: Category;
  icon: string;
}

export default function RecentActivityPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Activities');

  const categories: Category[] = ['All Activities', 'Dining', 'Groceries', 'Travel', 'Utilities'];

  // Sample activities - replace with your actual data
  const activities: Activity[] = [
    // Empty by default - will be populated from your backend
  ];

  const filteredActivities =
    selectedCategory === 'All Activities'
      ? activities
      : activities.filter((activity) => activity.category === selectedCategory);

  const getCategoryIcon = (category: Category) => {
    const icons: Record<Category, string> = {
      'All Activities': '📋',
      'Dining': '🍽️',
      'Groceries': '🛒',
      'Travel': '🚗',
      'Utilities': '⚡',
    };
    return icons[category] || '📋';
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recent Activity</h1>
        <p className="text-gray-400">Track all expense activity across your groups.</p>
      </div>

      {/* Category Filters */}
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

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#1a2738] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0d1726] rounded-lg flex items-center justify-center text-2xl">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-400">
                      {activity.date} · Paid by {activity.paidBy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${
                      activity.type === 'lent' ? 'text-blue-400' : 'text-red-400'
                    }`}
                  >
                    {activity.type === 'lent' ? 'You lent' : 'You owe'}{' '}
                    {activity.type === 'lent' ? '+' : ''}₹{activity.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1a2738] rounded-xl p-16 border border-gray-800 text-center">
            <svg
              className="w-20 h-20 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No recent activity</p>
            <p className="text-gray-500 text-sm mb-6">
              {selectedCategory !== 'All Activities'
                ? `No activities in ${selectedCategory} category`
                : 'Start adding expenses to see activity here'}
            </p>
            <a
              href="/expenses/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Expense
            </a>
          </div>
        )}
      </div>
    </>
  );
}