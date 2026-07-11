import axios from "axios";
import { COMPANY_INFO } from "../data/companyInfo.js";
import { logProviderFailure } from "../utils/chatFailureLogger.js";


const SYSTEM_PROMPT = `You are the AI assistant for BoostGuruSMM, an SMM panel reseller platform.
Use the business information below to answer user questions accurately. Help both existing users (orders, wallet, refunds) and new visitors (what we offer, why choose us).

${COMPANY_INFO}

Rules:
- Be concise and friendly.
- Never invent prices, delivery times, or policies not listed above.
- For account-specific data you don't have (live order status, wallet balance), tell the user to check their Dashboard.
- When your answer relates to a specific page the user should visit, end your reply with a tag in this exact format: [[GOTO:/path]]
  Valid paths: /add-funds, /new-order, /orders, /services, /profile, /notices, /transactions, /contact
  Example: "You can top up your wallet anytime. [[GOTO:/add-funds]]"
- Only include the [[GOTO:...]] tag when it's clearly relevant — don't force it into every reply.`;


const PROVIDERS = [
    {
        name: "cerebras",
        url: "https://api.cerebras.ai/v1/chat/completions",
        key: process.env.CEREBRAS_API_KEY,
        model: "gpt-oss-120b",
    },
    {
        name: "groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY,
        model: "openai/gpt-oss-20b", // llama-3.1-8b-instant deprecated by Groq (announced Jun 17, 2026)
    },
    {
        name: "google",
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        key: process.env.GOOGLE_API_KEY,
        model: "gemma-4-26b-a4b-it",
    },
    {
        name: "mistral",
        url: "https://api.mistral.ai/v1/chat/completions",
        key: process.env.MISTRAL_API_KEY,
        model: "mistral-small-latest", // or "open-mistral-7b" for a lighter/faster option
    }
];


async function callProvider(provider, messages) {
    const response = await axios.post(
        provider.url,
        { model: provider.model, messages, temperature: 0.7 },
        {
            headers: {
                Authorization: `Bearer ${provider.key}`,
                "Content-Type": "application/json",
            },
            timeout: 8000,
        }
    );
    let content = response.data.choices[0].message.content;
    // Strip inline reasoning/thinking blocks some providers (e.g. Gemma) may emit.
    // Covers <thought>...</thought> and <|think|>...<|/think|> style tags, all
    // occurrences (not just the first), in case a provider changes its tag format.
    content = content
        .replace(/<thought>[\s\S]*?<\/thought>/g, "")
        .replace(/<\|think\|>[\s\S]*?<\|\/think\|>/g, "")
        .trim();
    return content;
}

const MAX_HISTORY_TURNS = 6;
const MAX_MESSAGE_LENGTH = 2000;

export const sendChatMessage = async (req, res) => {
    const { message, history = [] } = req.body;
    if (!message?.trim()) {
        return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ success: false, message: "Message is too long." });
    }
    if (!Array.isArray(history)) {
        return res.status(400).json({ success: false, message: "Invalid history format." });
    }

    // Only allow user/assistant roles (blocks system-prompt injection via history),
    // require string content, and cap length server-side (client can't be trusted
    // to only send the last 6 turns — an attacker calling the API directly could
    // send an arbitrarily long array).
    const cleanHistory = history
        .filter(
            (m) =>
                (m?.role === "user" || m?.role === "assistant") &&
                typeof m?.content === "string" &&
                m.content.length <= MAX_MESSAGE_LENGTH
        )
        .slice(-MAX_HISTORY_TURNS)
        .map(({ role, content }) => ({ role, content }));

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...cleanHistory,
        { role: "user", content: message },
    ];

    for (const provider of PROVIDERS) {
        if (!provider.key) continue;
        try {
            const reply = await callProvider(provider, messages);
            return res.json({ success: true, data: { reply, provider: provider.name } });
        } catch (err) {
            console.warn(`${provider.name} failed (${err.response?.status || err.message}), trying next...`, err.response?.data);
            logProviderFailure(provider.name, err);
            continue;
        }
    }

    res.status(503).json({ success: false, message: "AI chat is temporarily unavailable, try again shortly." });
};