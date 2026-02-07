'use client';

import { useState } from 'react';
import Link from 'next/link';

type Category = 'Food' | 'Travel' | 'Housing' | 'Transport' | 'Shopping' | 'Other';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  paidBy: string;
  date: string;
  groupName: string;
}

const CATEGORIES: { name: Category; icon: string }[] = [
  { name: 'Food', icon: '🍴' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Housing', icon: '🏠' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Other', icon: '•••' },
];

const DUMMY_EXPENSES: Expense[] = [
  {
    id: '1',
    description: 'Lunch at Shibuya Crossing',
    amount: 48.5,
    category: 'Food',
    paidBy: 'You',
    date: 'March 14, 2024',
    groupName: 'Tokyo Trip 2024',
  },
  {
    id: '2',
    description: 'Train tickets to Kyoto',
    amount: 124.0,
    category: 'Travel',
    paidBy: 'Sarah Chen',
    date: 'March 13, 2024',
    groupName: 'Tokyo Trip 2024',
  },
  {
    id: '3',
    description: 'Groceries - weekly shop',
    amount: 89.32,
    category: 'Food',
    paidBy: 'David Miller',
    date: 'March 12, 2024',
    groupName: 'Apartment 4B',
  },
  {
    id: '4',
    description: 'Electric bill',
    amount: 156.0,
    category: 'Housing',
    paidBy: 'You',
    date: 'March 10, 2024',
    groupName: 'Apartment 4B',
  },
  {
    id: '5',
    description: 'Uber to airport',
    amount: 42.0,
    category: 'Transport',
    paidBy: 'Alex Wong',
    date: 'March 9, 2024',
    groupName: 'Tokyo Trip 2024',
  },
];

function getCategoryIcon(category: Category) {
  return CATEGORIES.find((c) => c.name === category)?.icon ?? '•••';
}

export default function AllExpensesPage() {
  const [search, setSearch] = useState('');

  const filteredExpenses = search.trim()
    ? DUMMY_EXPENSES.filter(
        (e) =>
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          e.groupName.toLowerCase().includes(search.toLowerCase())
      )
    : DUMMY_EXPENSES;

  const totalAmount = DUMMY_EXPENSES.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Expenses</h1>
            <p className="text-lg text-gray-400">View and manage all your shared expenses.</p>
          </div>
          <Link
            href="/expenses/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-[#0d1a2d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-[#0d1a2d] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Description
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Paid by
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">
                    Group
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-700 last:border-0 hover:bg-[#0a1628]/50 transition"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium">{expense.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-300">
                        <span>{getCategoryIcon(expense.category)}</span>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{expense.paidBy}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{expense.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{expense.groupName}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              No expenses match your search.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
          </span>
          <span className="font-medium text-white">Total: ${totalAmount.toFixed(2)}</span>
        </div>
      </main>
    </div>
  );
}
