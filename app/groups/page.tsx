import Link from 'next/link';

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Groups</h1>
        <p className="text-gray-400 mb-8">
          This is the groups overview page. You&apos;ll see all your groups here once the UI is wired up.
        </p>
        <Link
          href="/groups/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create a new group
        </Link>
      </main>
    </div>
  );
}

