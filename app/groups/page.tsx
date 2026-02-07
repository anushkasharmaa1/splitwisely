'use client';

import Link from 'next/link';
import { OrganizationList } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

export default function GroupsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Groups</h1>
            <p className="text-gray-400">
              Manage your expense-sharing groups and organizations.
            </p>
          </div>
          <Link
            href="/groups/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a new group
          </Link>
        </div>

        {user && (
          <div className="bg-[#1a2332] rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Your Organizations</h2>
            <OrganizationList
              hidePersonal={false}
              afterSelectOrganizationUrl="/groups"
              afterCreateOrganizationUrl="/groups/new"
            />
          </div>
        )}
      </main>
    </div>
  );
}

