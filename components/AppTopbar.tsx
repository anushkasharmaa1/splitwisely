'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function AppTopbar() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-[#0d1221] border-b border-gray-800 flex items-center px-6">
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full bg-[#1a2332] text-sm text-gray-300 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
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
      </div>

      {/* Center: Nav */}
      <nav className="hidden md:flex items-center gap-6 mx-8">
        <TopbarLink href="/dashboard" label="Dashboard" active={pathname === '/dashboard'} />
        <TopbarLink href="/activity" label="Recent Activity" active={pathname === '/activity'} />
        <TopbarLink href="/expenses" label="All Expenses" active={pathname === '/expenses'} />
        <TopbarLink href="/groups" label="Groups" active={pathname === '/groups'} />
      </nav>

      {/* Right: Icons */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-[#1a2332] transition">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-[#1a2332] transition">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Avatar */}
        <UserButton 
  afterSignOutUrl="/"
  appearance={{
    elements: {
      avatarBox: "w-9 h-9 cursor-pointer",
      userButtonPopoverCard: "bg-white shadow-xl",
      userButtonPopoverActions: "bg-white",
      userButtonPopoverActionButton: "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverActionButtonIcon: "text-gray-600",
      userButtonPopoverFooter: "bg-gray-50 border-t border-gray-200"
    }
  }}
/>
      </div>
    </header>
  );
}

/* ---------- Helper ---------- */

function TopbarLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm transition ${
        active ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}