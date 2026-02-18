'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Member = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: string;
};

type Group = {
  id: string;
  name: string;
  type: string;
  members: Member[];
  currentUserRole: string;
};

export default function GroupMembersPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add member form state
  const [email, setEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addMemberSuccess, setAddMemberSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch group');
      }

      const data = await response.json();
      console.log('Fetched group data:', data);
      
      // Extract the group object from the response
      const groupData = data.group || data;
      console.log('Group object:', groupData);
      console.log('Members array:', groupData.members);
      
      setGroup(groupData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching group:', err);
      setError(err.message || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setAddMemberError(null);
    setAddMemberSuccess(null);

    if (!email.trim()) {
      setAddMemberError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAddMemberError('Please enter a valid email address');
      return;
    }

    try {
      setAddingMember(true);
      
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member');
      }

      // Success!
      setAddMemberSuccess(`${data.member.name || data.member.email} has been added to the group!`);
      setEmail(''); // Clear the input
      
      // Refresh the group data to show the new member
      await fetchGroup();

    } catch (err: any) {
      console.error('Error adding member:', err);
      setAddMemberError(err.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading group...</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-400">Error: {error || 'Group not found'}</div>
        <Link
          href="/groups"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/groups"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{group?.members?.length ?? 0} member{(group?.members?.length ?? 0) !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>0 expenses</span>
        </div>
      </div>

      {/* Add Member Form */}
      <div className="bg-[#1a2738] rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Add Member</h2>
        
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-3 bg-[#0d1726] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={addingMember}
            />
            <p className="mt-2 text-xs text-gray-500 flex items-start gap-2">
              <span className="text-yellow-500">💡</span>
              The person must already be signed up with Splitwisely
            </p>
          </div>

          {/* Error Message */}
          {addMemberError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{addMemberError}</p>
            </div>
          )}

          {/* Success Message */}
          {addMemberSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 text-sm">{addMemberSuccess}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={addingMember || !email.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {addingMember ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Members ({group?.members?.length ?? 0})
        </h2>

        {/* Check if members exists and has items */}
        {group.members && group.members.length > 0 ? (
          <div className="space-y-3">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="bg-[#1a2738] rounded-xl p-4 border border-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name || member.email}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center font-bold text-white text-lg">
                      {(member.name || member.email)[0].toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div>
                    <div className="font-semibold text-white">
                      {member.name || 'User'}
                    </div>
                    <div className="text-sm text-gray-400">{member.email}</div>
                  </div>
                </div>

                {/* Role Badge */}
                {member.role === 'admin' && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                    admin
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1a2738] rounded-xl p-6 border border-gray-700 text-center">
            <p className="text-gray-400">No members yet</p>
          </div>
        )}
      </div>
    </div>
  );
}