'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Group = {
  id: string;
  name: string;
  type: string;
  memberCount: number;
};

type Member = {
  id: string;
  name: string | null;
  email: string;
};

export default function AddExpensePage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGroups, setFetchingGroups] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    groupId: '',
    paidById: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (formData.groupId) fetchGroupMembers(formData.groupId);
  }, [formData.groupId]);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch groups');

      setGroups(data.groups);
      if (data.groups.length > 0) {
        setFormData(prev => ({ ...prev, groupId: data.groups[0].id }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchingGroups(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.group.members);
        setFormData(prev => ({
          ...prev,
          paidById: data.group.members[0]?.id || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          groupId: formData.groupId,
          paidById: formData.paidById,
          splitType: 'equal',
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) throw new Error(data?.error || 'Failed to create expense');

      router.push('/expenses');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
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

  if (fetchingGroups) {
    return (
      <div className="max-w-2xl">
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
          <p className="text-gray-400 mb-6">
            You need to create a group before adding expenses
          </p>
          <Link
            href="/groups/new"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
          >
            Create Your First Group
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/expenses"
          className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
        >
          ← Cancel
        </Link>
        <h1 className="text-3xl font-bold">Add New Expense</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Dinner at Social"
                required
                className="w-full px-4 py-3 bg-[#0d1726] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
                min="0.01"
                className="w-full px-4 py-3 bg-[#0d1726] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Food', 'Travel', 'Housing', 'Transport', 'Shopping', 'Other'].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFormData({ ...formData, category })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === category
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-[#1a2738] hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getCategoryIcon(category)}</div>
                    <div className="text-xs font-medium">{category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Group
              </label>
              <select
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0d1726] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.memberCount} {group.memberCount === 1 ? 'member' : 'members'})
                  </option>
                ))}
              </select>
            </div>

            {/* Paid By */}
            {members.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paid by
                </label>
                <select
                  value={formData.paidById}
                  onChange={(e) => setFormData({ ...formData, paidById: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0d1726] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.description || !formData.amount || !formData.groupId}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
            >
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-[#1a2738] border border-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">💡 Pro Tip</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Expenses are automatically split equally among all group members. You'll be able to see who owes what on the expenses page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}