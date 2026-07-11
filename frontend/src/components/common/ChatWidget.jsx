import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const renderFormatted = (text) => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    const parseBold = (str) =>
        str.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>
            ) : (
                part
            )
        );

    return lines.map((line, i) => {
        const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
            return (
                <div key={i} className="mb-1 flex gap-1.5">
                    <span className="text-indigo-300">{numberedMatch[1]}.</span>
                    <span>{parseBold(numberedMatch[2])}</span>
                </div>
            );
        }
        return <p key={i} className="mb-1.5 last:mb-0">{parseBold(line)}</p>;
    });
};

// Extracts a [[GOTO:/path]] tag from the reply and returns clean text + the path (or null)
const extractRedirect = (text) => {
    const match = text.match(/\[\[GOTO:([^\]]+)\]\]/);
    if (!match) return { cleanText: text, path: null };
    return { cleanText: text.replace(match[0], "").trim(), path: match[1].trim() };
};

const PAGE_LABELS = {
    "/add-funds": "Go to Wallet",
    "/new-order": "Place an Order",
    "/orders": "View My Orders",
    "/services": "View Services",
    "/profile": "Go to Profile",
    "/notices": "View Notices",
    "/transactions": "View Transactions",
    "/contact": "Contact Support",
};

const ChatWidget = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: "user", content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post("/chat", {
                message: userMsg.content,
                history: messages.slice(-6),
            });
            const { cleanText, path } = extractRedirect(data.data.reply);
            setMessages((prev) => [...prev, { role: "assistant", content: cleanText, redirect: path }]);
        } catch (err) {
            const status = err.response?.status;
            const msg =
                status === 429
                    ? "You're sending messages too fast — please wait a bit and try again."
                    : status === 503
                        ? "AI chat is temporarily unavailable, try again shortly."
                        : "Connection issue — please check your internet and try again.";
            setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {open && (
                <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#181826] shadow-2xl shadow-indigo-950/50 animate-in slide-in-from-right-4 fade-in duration-200">
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">💬</span>
                            <div>
                                <p className="text-sm font-semibold text-white leading-tight">Boost Guru Assistant</p>
                                <p className="text-[11px] text-indigo-100/80 leading-tight">Online • Replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto bg-[#12121c] p-3 text-sm">
                        {messages.length === 0 && (
                            <p className="text-xs text-slate-400">Hi! Ask me about services, orders, wallet, or refunds.</p>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                                <span
                                    className={`inline-block max-w-[85%] rounded-2xl px-3 py-1.5 text-left ${m.role === "user"
                                        ? "rounded-br-sm bg-indigo-600 text-white"
                                        : "rounded-bl-sm bg-slate-700 text-slate-100"
                                        }`}
                                >
                                    {m.role === "assistant" ? renderFormatted(m.content) : m.content}
                                </span>
                                {m.role === "assistant" && m.redirect && PAGE_LABELS[m.redirect] && (
                                    <div className="mt-1">
                                        <button
                                            onClick={() => {
                                                navigate(m.redirect);
                                                setOpen(false);
                                            }}
                                            className="rounded-full bg-indigo-600/20 border border-indigo-500 px-3 py-1 text-xs font-medium text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
                                        >
                                            {PAGE_LABELS[m.redirect]} →
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-left">
                                <span className="inline-block rounded-2xl rounded-bl-sm bg-slate-700 px-3 py-1.5 text-xs text-slate-300">
                                    Typing…
                                </span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="flex gap-2 border-t border-slate-700 bg-[#181826] p-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask something…"
                            className="flex-1 rounded-full bg-slate-800 px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="rounded-full bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            <div className="relative flex h-12 w-12 items-center justify-center">
                {!open && (
                    <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-60"></span>
                        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-indigo-600 opacity-20"></span>
                    </>
                )}
                <button
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Close chat" : "Open chat"}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/50 transition hover:scale-105 hover:shadow-xl"
                >
                    {open ? "✕" : "💬"}
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;