'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  expenseCount: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups');
      const data = await response.json();

      if (response.ok) {
        setGroups(data.groups || []);
      } else {
        setError(data.error || 'Failed to fetch groups');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const getGroupIcon = (type: string) => {
    const icons: Record<string, string> = {
      Trip: '✈️',
      Home: '🏠',
      Food: '🍽️',
      Other: '•••',
    };
    return icons[type] || '•••';
  };

  const getGroupColor = (type: string) => {
    const colors: Record<string, string> = {
      Trip: 'bg-gradient-to-br from-blue-500 to-blue-600',
      Home: 'bg-gradient-to-br from-green-500 to-green-600',
      Food: 'bg-gradient-to-br from-orange-500 to-orange-600',
      Other: 'bg-gradient-to-br from-purple-500 to-purple-600',
    };
    return colors[type] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchGroups}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Groups</h1>
          <p className="text-gray-400">Manage your expense-sharing groups and organizations.</p>
        </div>
        <Link
          href="/groups/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
        >
          <span className="text-lg">＋</span>
          Create a new group
        </Link>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.id}
              className="bg-[#1a2738] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-16 h-16 ${getGroupColor(
                      group.type
                    )} rounded-xl flex items-center justify-center text-3xl`}
                  >
                    {getGroupIcon(group.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{group.name}</h3>
                    <p className="text-sm text-gray-400">
                      {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'} ·{' '}
                      {group.expenseCount} {group.expenseCount === 1 ? 'expense' : 'expenses'}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/groups/${group.id}/members`}
                  className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-sm font-medium"
                >
                  Manage Members →
                </Link>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No groups yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Create your first group to start tracking shared expenses with friends and family
            </p>
            <Link
              href="/groups/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Group
            </Link>
          </div>
        )}
      </div>
    </>
  );
}