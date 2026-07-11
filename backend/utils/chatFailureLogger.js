import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// backend/logs/chat-provider-failures.log
const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "chat-provider-failures.log");

// Make sure backend/logs/ exists before we try to write to it.
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Appends one JSON line per failed AI provider call.
 * Called from chatController.js whenever a provider (Cerebras/Groq/Google/Mistral) fails.
 */
export function logProviderFailure(provider, err) {
    const entry = {
        time: new Date().toISOString(),
        provider,
        status: err.response?.status || null,
        message: err.response?.data?.error?.message || err.message || "unknown error",
    };

    // Append, don't overwrite — one JSON object per line so the file stays
    // easy to read (open it in any text editor) and easy to parse later if needed.
    fs.appendFile(LOG_FILE, JSON.stringify(entry) + "\n", (err) => {
        if (err) console.error("Failed to write to chat-provider-failures.log:", err.message);
    });
}