import { useEffect, useRef, useState } from "react";
import { Zap, ShieldCheck, CreditCard, Droplets, Headphones, RefreshCcw } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant delivery", text: "Most orders start within 60 seconds of confirmation." },
  { icon: ShieldCheck, title: "Real accounts", text: "Genuine profiles, no bots — your account stays safe." },
  { icon: CreditCard, title: "Secure payments", text: "Pay using UPI Instant payment and safe." },
  { icon: Droplets, title: "Drip-feed", text: "Space delivery over hours or days for natural growth." },
  { icon: Headphones, title: "24/7 support", text: "Real humans on live chat around the clock." },
  { icon: RefreshCcw, title: "Refill guarantee", text: "Automatic top-ups if numbers ever drop." },
];

export function SectionHeader({ eyebrow, title }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--neon-cyan)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-black sm:text-4xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group rounded-2xl glass-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(135deg, oklch(0.62 0.24 295 / .3), oklch(0.82 0.16 205 / .3))" }}
      >
        <Icon className="h-5 w-5 text-[color:var(--neon-cyan)]" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function Features() {
  return (
    <section className="relative pt-10">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Why BoostGuruSMM" title="Built for creators who move fast" />
        <div className="mt-14 grid gap-5 grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}