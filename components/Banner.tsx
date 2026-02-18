import Link from 'next/link';

export default function Banner() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Modern Group Splitting
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 leading-tight">
              Split expenses
              <br />
              without the <span className="text-blue-500">stress</span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 mb-10 md:mb-12 max-w-lg leading-relaxed">
              The easiest way to share bills with friends and roommates. Track balances, settle up, and keep
              your relationships drama-free.
            </p>
            <div className="flex items-center gap-6 mb-10 md:mb-12">
              <Link
                href="/groups/new"
                className="p-8 text-sm md:text-base bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
              >
                Get Started for Free
              </Link>
              <Link
                href="/expenses/history"
                className="p-8 text-sm md:text-base bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
              >
                View Demo
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#0a1628]"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#0a1628]"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-[#0a1628]"></div>
              </div>
              <p className="text-sm text-gray-500">Joined by 10,000+ roommates worldwide</p>
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
  );
}
