import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18 0a2 2 0 00-2-2h-1V8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8H1a2 2 0 00-2 2" />
          </svg>
        </div>
        <span className="text-xl font-bold">Splitwisely</span>
      </div>

      {/* Nav Links - hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-gray-300 hover:text-white transition">
          Features
        </a>
        <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
          Login
        </Link>
        <Link
          href="/groups/new"
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center gap-3">
        <Link href="/dashboard" className="text-gray-300 hover:text-white transition text-sm">
          Login
        </Link>
        <Link
          href="/groups/new"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition text-sm"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Modern Group Splitting
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
  Split expenses
  <br />
  without the <span className="text-blue-500">stress</span>
</h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                The easiest way to share bills with friends and roommates. Track balances, settle up, and keep
                your relationships drama-free.
              </p>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
  {/* Left Content - stays */}
  <div>
    ...
  </div>
  {/* Right Illustration - hide on mobile */}
  <div className="relative hidden lg:block">
    ...
  </div>
</div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl p-12 border border-gray-700 shadow-2xl">
                <div className="bg-white/90 rounded-lg p-8 shadow-lg">
                  {/* Illustration of people splitting money */}
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-blue-900 rounded-t-full"></div>
                      <div className="w-16 h-24 bg-blue-800 rounded-b-lg"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-blue-900 rounded-t-full"></div>
                      <div className="w-16 h-24 bg-blue-800 rounded-b-lg"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-blue-900 rounded-t-full"></div>
                      <div className="w-16 h-24 bg-blue-800 rounded-b-lg"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-blue-900 rounded-t-full"></div>
                      <div className="w-16 h-24 bg-blue-800 rounded-b-lg"></div>
                    </div>
                  </div>
                  {/* Money/coin icon above */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-orange-300 rounded-full opacity-80"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0d1726]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to manage group finances</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We've built the most powerful splitting engine so you can focus on the memories, not the math.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[#1a2738] rounded-2xl p-8 border border-gray-800/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Easy Group Setup</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Create groups for trips, households, or dinners in seconds. Add members via a simple link or QR
                code.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a2738] rounded-2xl p-8 border border-gray-800/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Splitting</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Whether it's equal splits, percentages, or specific amounts, our engine handles the complex math
                for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a2738] rounded-2xl p-8 border border-gray-800/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Instant Activity Logs</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stay in the loop with a real-time feed of every expense added, edited, or settled up by anyone in
                the group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#1a2738]/60 rounded-3xl p-12 text-center border border-gray-700/30">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to simplify your shared expenses?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Splitwisely for stress-free splitting and drama-free living.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/groups/new"
                className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition shadow-lg"
              >
                Get Started Now
              </Link>
              <Link
                href="#features"
                className="px-8 py-3.5 bg-transparent hover:bg-gray-700/30 text-white rounded-lg font-semibold transition border border-gray-600/50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-[#0d1726]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18 0a2 2 0 00-2-2h-1V8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8H1a2 2 0 00-2 2" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Splitwisely</span>
              </div>
              <p className="text-sm text-gray-400">
                The smartest way to split bills and track shared expenses with friends and roommates.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCT</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">CONNECT</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2024 Splitwisely Inc. Designed for effortless group living.
          </div>
        </div>
      </footer>
    </div>
  );
}

