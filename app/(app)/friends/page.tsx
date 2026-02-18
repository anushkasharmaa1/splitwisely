'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  sharedGroups: number;
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Empty friends array - will be populated from your backend
  const friends: Friend[] = [];

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Friends</h1>
        <p className="text-gray-400">Manage your friends and see who you owe or who owes you.</p>
      </div>

      {/* Search and Add Friend */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-[#1a2738] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 pl-10"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"
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
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">
          <span className="text-lg">＋</span>
          Add Friend
        </button>
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-[#1a2738] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 ${friend.avatar} rounded-full flex items-center justify-center text-xl font-bold text-white`}
                  >
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{friend.name}</h3>
                    <p className="text-sm text-gray-400">
                      {friend.email} · {friend.sharedGroups} shared groups
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {friend.balance === 0 ? (
                    <div className="text-lg text-gray-400">Settled up</div>
                  ) : (
                    <>
                      <div className="text-sm text-gray-400 mb-1">
                        {friend.balance > 0 ? 'Owes you' : 'You owe'}
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          friend.balance > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ₹{Math.abs(friend.balance).toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : friends.length === 0 ? (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No friends yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Add friends to start splitting expenses and tracking who owes what
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Friend
            </button>
          </div>
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-400">No friends found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </>
  );
}