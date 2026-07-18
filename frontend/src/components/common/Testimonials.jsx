import { Instagram, Facebook, Youtube, Star } from "lucide-react";

const reviews = [
    { name: "Aisha K.", role: "Fashion creator", platform: Instagram, text: "Went from 2k to 40k in six weeks. Zero drops.", color: "text-pink-300" },
    { name: "Marco D.", role: "Gaming YouTuber", platform: Youtube, text: "Watch-time boost got me monetized. Insane speed.", color: "text-red-400" },
    { name: "Sam O.", role: "Local biz owner", platform: Facebook, text: "Page likes doubled our leads in a month.", color: "text-sky-300" },
    { name: "Priya R.", role: "Coach", platform: Instagram, text: "Support answered in 40 seconds. Legendary.", color: "text-pink-300" },
    { name: "Lucas T.", role: "Music producer", platform: Youtube, text: "Cheapest panel that actually delivers real views.", color: "text-red-400" },
    { name: "Nadia V.", role: "Agency owner", platform: Facebook, text: "API + drip-feed = we run clients on autopilot.", color: "text-sky-300" },
];

function SectionHeader({ eyebrow, title }) {
    return (
        <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--neon-cyan)]">
                {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-black sm:text-4xl">{title}</h2>
        </div>
    );
}

export function Testimonials() {
    const loop = [...reviews, ...reviews];
    return (
        <section className="relative py-28 overflow-hidden">
            <style>{`
        @keyframes testimonial-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: testimonial-marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div className="mx-auto max-w-6xl px-6">
                <SectionHeader eyebrow="Loved by creators" title="What people are saying" />
            </div>

            <div className="mt-14 relative">
                {/* Fade edges now use the page's actual background, not a hardcoded color */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-40 sm:w-56 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-40 sm:w-56 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

                <div className="flex w-max animate-marquee gap-5 px-6">
                    {loop.map((r, i) => {
                        const Icon = r.platform;
                        return (
                            <div key={i} className="w-[320px] shrink-0 rounded-2xl glass-card p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full"
                                        style={{ background: "linear-gradient(135deg, oklch(0.62 0.24 295 / .5), oklch(0.82 0.16 205 / .5))" }}>
                                        <span className="font-display text-sm font-bold">{r.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">{r.name}</div>
                                        <div className="text-xs text-muted-foreground">{r.role}</div>
                                    </div>
                                    <Icon className={`ml-auto h-5 w-5 ${r.color}`} />
                                </div>
                                <div className="mt-3 flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}