const items = [
    "🚀 Instant delivery",
    "🛡️ Refill guarantee",
    "🌍 Indian Services",
    "🔒 Secure payments",
    "📈 Real engagement",
    "🕐 24/7 support",
    "😎 Trusted Pannel",
];

export function StatsMarquee() {
    return (
        <section aria-hidden className="relative border-y border-white/5 py-5 overflow-hidden">
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm text-muted-foreground">
                {[...items, ...items, ...items].map((t, i) => (
                    <span key={i} className="flex items-center gap-3">
                        {t}
                        <span className="text-[color:var(--neon-cyan)]">✦</span>
                    </span>
                ))}
            </div>
        </section>
    );
}