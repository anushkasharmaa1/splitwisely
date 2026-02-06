'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type GroupCategory = 'TRIP' | 'HOME' | 'FOOD' | 'OTHER';

interface Member {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  status: 'confirmed' | 'pending';
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState<GroupCategory>('TRIP');
  const [inviteEmail, setInviteEmail] = useState('');
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      isAdmin: true,
      status: 'confirmed',
    },
    {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah.m@gmail.com',
      isAdmin: false,
      status: 'pending',
    },
    {
      id: '3',
      name: 'Mike Ross',
      email: 'mike_ross@firm.com',
      isAdmin: false,
      status: 'pending',
    },
  ]);

  const pendingCount = members.filter((m) => m.status === 'pending').length;

  const handleAddMember = () => {
    if (!inviteEmail.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      isAdmin: false,
      status: 'pending',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleCreateGroup = () => {
    // Handle group creation logic here
    console.log({ groupName, category, members });
    // Navigate to groups page or newly created group
    router.push('/group');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18 0a2 2 0 00-2-2h-1V8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8H1a2 2 0 00-2 2" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Splitwisely</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </a>
                <a href="/activity" className="text-gray-400 hover:text-white transition">
                  Activity
                </a>
                <a href="/expenses" className="text-gray-400 hover:text-white transition">
                  Expenses
                </a>
                <a href="/group" className="text-blue-500 font-medium">
                  Groups
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="w-64 px-4 py-2 bg-[#1a2332] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-500"
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
              <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/group')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Groups
          </button>
          <h1 className="text-4xl font-bold mb-2">Create New Group</h1>
          <p className="text-gray-400">Start a new circle to manage shared expenses easily.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Group Details */}
          <div className="bg-[#1a2332] rounded-xl p-8 border border-gray-800">
            {/* Group Identity */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Group Identity</h2>
              <p className="text-gray-400 text-sm mb-6">
                Upload a unique photo or use a default travel, home, or meal icon.
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-4v-4H7v-2h3V7h4v4h3v2h-3v4z" />
                  </svg>
                </div>
                <button className="px-6 py-2.5 bg-[#0a0f1e] hover:bg-[#141b2e] rounded-lg transition">
                  Change Image
                </button>
              </div>
            </div>

            {/* Group Name */}
            <div className="mb-8">
              <label className="block text-base font-medium mb-3">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., European Summer Trip 2024"
                className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Group Category */}
            <div className="mb-8">
              <label className="block text-base font-medium mb-3">Group Category</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 'TRIP', icon: '✈️', label: 'TRIP' },
                  { value: 'HOME', icon: '🏠', label: 'HOME' },
                  { value: 'FOOD', icon: '🍽️', label: 'FOOD' },
                  { value: 'OTHER', icon: '•••', label: 'OTHER' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as GroupCategory)}
                    className={`p-4 rounded-lg border-2 transition ${
                      category === cat.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-[#0a0f1e] hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Invite Friends */}
            <div>
              <label className="block text-base font-medium mb-3">Invite Friends</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                  placeholder="Enter email or username"
                  className="flex-1 px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddMember}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z" />
                  </svg>
                  Add
                </button>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateGroup}
              className="w-full mt-8 px-6 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-lg transition"
            >
              Create Group
            </button>
          </div>

          {/* Right Column - Members & Tips */}
          <div className="space-y-6">
            {/* Members List */}
            <div className="bg-[#1a2332] rounded-xl p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Members ({members.length})
                </h2>
                {pendingCount > 0 && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                    PENDING: {pendingCount}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-[#0a0f1e] border border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.name} {member.isAdmin && '(You)'}
                        </div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.isAdmin ? (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                          ADMIN
                        </span>
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                            MEMBER
                          </span>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1.5 hover:bg-gray-700 rounded transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <p className="text-sm text-gray-300">
                  Invited members will receive an email to join the group. You can adjust permissions
                  and assign multiple admins after the group is created.
                </p>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-500 rounded-xl p-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                  <p className="text-blue-50">
                    "Trip" groups allow you to split costs by specific dates and currencies, making
                    travel expense tracking a breeze!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
