'use client';

import { useState } from 'react';
import Link from 'next/link';

type GroupCategory = 'TRIP' | 'HOME' | 'FOOD' | 'OTHER';

const CATEGORIES: { value: GroupCategory; icon: string; label: string }[] = [
  { value: 'TRIP', icon: '✈️', label: 'Trip' },
  { value: 'HOME', icon: '🏠', label: 'Home' },
  { value: 'FOOD', icon: '🍽️', label: 'Food' },
  { value: 'OTHER', icon: '•••', label: 'Other' },
];

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState<GroupCategory>('TRIP');
  const [inviteInput, setInviteInput] = useState('');

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-2xl">
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Groups
            </Link>
            <h1 className="text-4xl font-bold mb-2">Create New Group</h1>
            <p className="text-lg text-gray-400">Start a new circle to manage shared expenses easily.</p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-gray-700 bg-[#0d1a2d] p-8 shadow-sm">
              {/* Group Name */}
              <div className="mb-8">
                <label htmlFor="group-name" className="block text-base font-medium mb-3">
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. European Summer Trip 2024"
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a1628] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Group Type / Category */}
              <div className="mb-8">
                <label className="block text-base font-medium mb-3">Group Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        category === cat.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-[#0a1628] hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-sm font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Invite Members (UI only) */}
              <div className="mb-8">
                <label htmlFor="invite-members" className="block text-base font-medium mb-3">
                  Invite Members
                </label>
                <input
                  id="invite-members"
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="Enter email or username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#0a1628] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Create Group button */}
              <button
                type="button"
                className="w-full rounded-lg bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
