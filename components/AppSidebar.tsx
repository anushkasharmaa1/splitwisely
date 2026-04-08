'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
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

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1221] border-t border-gray-800 flex items-center justify-around px-2 py-2 pb-8 md:hidden">
        <MobileNavLink href="/dashboard" label="Home" active={pathname === '/dashboard'}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </MobileNavLink>
        <MobileNavLink href="/activity" label="Activity" active={pathname === '/activity'}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5v-5l-2.28 2.28C7.81 18 6 15.21 6 12c0-4.08 3.05-7.44 7-7.93V2.05z" />
          </svg>
        </MobileNavLink>
        <MobileNavLink href="/expenses/new" label="Add" active={false}>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center -mt-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </MobileNavLink>
        <MobileNavLink href="/groups" label="Groups" active={pathname === '/groups'}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </MobileNavLink>
        <MobileNavLink href="/friends" label="Friends" active={pathname === '/friends'}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </MobileNavLink>
      </nav>
    </>
  );
}

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

function MobileNavLink({
  href, label, active, children
}: {
  href: string; label: string; active: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
        active ? 'text-blue-400' : 'text-gray-400'
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </Link>
  );
}