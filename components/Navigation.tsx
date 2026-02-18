'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18 0a2 2 0 00-2-2h-1V8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8H1a2 2 0 00-2 2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Splitwisely</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition">
              About
            </a>

            {/* AUTH SECTION */}
            <SignedOut>
              <Link href="/sign-in" className="text-gray-300 hover:text-white transition">
                Login
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition"
              >
                Get Started
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
