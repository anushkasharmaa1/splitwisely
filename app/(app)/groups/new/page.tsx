'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Trip',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      // Success! Redirect to groups page
      router.push('/groups');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/groups"
          className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
        >
          ← Back to Groups
        </Link>
        <h1 className="text-3xl font-bold">Create New Group</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Group Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Tokyo Trip 2024"
            required
            className="w-full px-4 py-3 bg-[#0d1726] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Group Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Group Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Trip', 'Home', 'Food', 'Other'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type })}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-[#1a2738] hover:border-gray-600'
                  }
                `}
              >
                <div className="text-2xl mb-2">
                  {type === 'Trip' && '✈️'}
                  {type === 'Home' && '🏠'}
                  {type === 'Food' && '🍔'}
                  {type === 'Other' && '📌'}
                </div>
                <div className="text-sm font-medium">{type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.name}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}