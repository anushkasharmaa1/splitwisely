export default function Features() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Everything you need to manage group finances
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            We’ve built the most powerful splitting engine so you can focus on
            the memories, not the math.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Easy Group Setup",
              desc: "Create groups for trips, households, or dinners in seconds.",
              icon: "👥",
            },
            {
              title: "Smart Splitting",
              desc: "Split equally, by percentage, or custom amounts.",
              icon: "🧮",
            },
            {
              title: "Instant Activity Logs",
              desc: "See every expense added or settled in real time.",
              icon: "⚡",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-blue-500/10 bg-[#0f172a] p-8 transition hover:border-blue-500/40 hover:-translate-y-1"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
