'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0d1221] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18 0a2 2 0 00-2-2h-1V8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8H1a2 2 0 00-2 2" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Splitwisely</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <SidebarLink href="/dashboard" label="Dashboard" active={pathname === '/dashboard'} />
        <SidebarLink href="/activity" label="Recent Activity" active={pathname === '/activity'} />
        <SidebarLink href="/expenses" label="All Expenses" active={pathname === '/expenses'} />
        <SidebarLink href="/groups" label="Groups" active={pathname === '/groups'} />
        <SidebarLink href="/friends" label="Friends" active={pathname === '/friends'} />
      </nav>

      {/* Add Expense Button */}
      <div className="px-4 py-6 border-t border-gray-800 mt-auto">
        <Link
          href="/expenses/new"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition text-white"
        >
          <span className="text-lg">＋</span>
          Add Expense
        </Link>
      </div>
    </aside>
  );
}

/* ---------- Helper Components ---------- */

function SidebarLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-[#1a2738] text-white font-medium'
          : 'text-gray-400 hover:bg-[#1a2332] hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
