import { UserPlus, Wallet, MousePointerClick, Rocket } from "lucide-react";

const steps = [
    { icon: UserPlus, title: "Create account", text: "Sign up in under 30 seconds — no verification required." },
    { icon: Wallet, title: "Add funds", text: "Top up via UPI. Instant credit to your wallet." },
    { icon: MousePointerClick, title: "Pick a service", text: "Choose your platform, service and target link." },
    { icon: Rocket, title: "Watch it grow", text: "Delivery starts within seconds. Track live progress." },
];

const HowItWorks = () => (
    <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">How it works</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Four steps to viral</h2>
        </div>

        <div className="relative mt-10 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <style>{`
  @keyframes badgeBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.25); }
  }
`}</style>

            {steps.map((s, i) => (
                <div
                    key={s.title}
                    className="glass relative rounded-lg p-5 text-center border"
                    style={{ animation: `chaseGlow 4.8s linear infinite`, animationDelay: `${i * 1.2}s` }}
                >
                    <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        <s.icon className="h-5 w-5 text-mint" />
                        <span
                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand to-ocean text-[10px] font-bold text-white"
                            style={{ animation: `badgeBounce 1.8s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                        >
                            {i + 1}
                        </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{s.text}</p>
                </div>
            ))}
        </div>
    </section>
);

export default HowItWorks;