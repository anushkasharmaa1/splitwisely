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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchGroups(); }, []);

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

  const handleDelete = async (groupId: string, groupName: string) => {
    if (!confirm(`Are you sure you want to delete "${groupName}"?`)) return;
    setDeletingId(groupId);
    try {
      const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setGroups(prev => prev.filter(g => g.id !== groupId));
      } else {
        alert(data.error || 'Failed to delete group');
      }
    } catch {
      alert('Failed to delete group');
    } finally {
      setDeletingId(null);
    }
  };

  const getGroupIcon = (type: string) => {
    const icons: Record<string, string> = { Trip: '✈️', Home: '🏠', Food: '🍽️', Other: '•••' };
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
        <button onClick={fetchGroups} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Groups</h1>
          <p className="text-gray-400 text-sm">Manage your expense-sharing groups.</p>
        </div>
        <Link
          href="/groups/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition text-sm whitespace-nowrap"
        >
          ＋ Create a new group
        </Link>
      </div>

      <div className="space-y-3">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="bg-[#1a2738] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex-shrink-0 ${getGroupColor(group.type)} rounded-xl flex items-center justify-center text-2xl`}>
                  {getGroupIcon(group.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{group.name}</h3>
                  <p className="text-xs text-gray-400">
                    {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'} · {group.expenseCount} {group.expenseCount === 1 ? 'expense' : 'expenses'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Link
                  href={`/groups/${group.id}/members`}
                  className="flex-1 text-center px-3 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-xs font-medium"
                >
                  Manage Members →
                </Link>
                <button
                  onClick={() => handleDelete(group.id, group.name)}
                  disabled={deletingId === group.id}
                  className="flex-1 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition text-xs font-medium disabled:opacity-50"
                >
                  {deletingId === group.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1a2738] rounded-xl p-12 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg mb-2">No groups yet</p>
            <p className="text-gray-500 text-sm mb-6">Create your first group to start splitting expenses</p>
            <Link href="/groups/new" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">
              Create Your First Group
            </Link>
          </div>
        )}
      </div>
    </>
  );
}