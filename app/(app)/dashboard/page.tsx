'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  title: string;
  paidBy: string;
  category: string;
  group: string;
  amount: number;
  type: 'owe' | 'owed';
  date: string;
}

interface DashboardData {
  totalBalance: number;
  youOwe: number;
  youAreOwed: number;
  owedToPeople: number;
  owedFromPeople: number;
  recentActivity: Activity[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  const totalBalance = data?.totalBalance || 0;
  const youOwe = data?.youOwe || 0;
  const youAreOwed = data?.youAreOwed || 0;
  const owedToPeople = data?.owedToPeople || 0;
  const owedFromPeople = data?.owedFromPeople || 0;
  const recentActivities = data?.recentActivity || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your shared expenses and balances.</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a2738] rounded-xl p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Total Balance</div>
          <div className="text-3xl font-bold mb-1">₹{totalBalance.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Across all groups</div>
        </div>

        <div className="bg-[#1a2738] rounded-xl p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">You Owe</div>
          <div className="text-3xl font-bold mb-1 text-red-400">₹{youOwe.toFixed(2)}</div>
          <div className="text-xs text-gray-500">To {owedToPeople} people</div>
        </div>

        <div className="bg-[#1a2738] rounded-xl p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">You Are Owed</div>
          <div className="text-3xl font-bold mb-1 text-green-400">₹{youAreOwed.toFixed(2)}</div>
          <div className="text-xs text-gray-500">From {owedFromPeople} people</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-[#1a2738] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-400">
                      Paid by {activity.paidBy} • {activity.category} • {activity.group}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        activity.type === 'owe' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {activity.type === 'owe' ? '-' : '+'} ₹{activity.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1a2738] rounded-xl p-12 border border-gray-800 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-600 mb-4"
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
              <p className="text-gray-400 mb-4">No recent activity</p>
              <Link
                href="/expenses/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Expense
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
