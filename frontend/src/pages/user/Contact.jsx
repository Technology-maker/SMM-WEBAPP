import { useState } from "react";
import { Mail, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { contactUs } from "../../api/authAPI";

const Contact = () => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await contactUs(form);

            if (response.success) {
                toast.success(response.message);

                setForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(response.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Contact Us</h1>
                <p className="text-sm text-slate-400">
                    Have a question, issue, or suggestion? Send us a message.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                {/* Left Card */}
                <div className="glass rounded-xl p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="text-primary" size={22} />
                    </div>

                    <h2 className="text-lg font-semibold">
                        Need Help?
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Our support team is ready to help you with orders,
                        payments, account issues, or any other questions.
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare
                                size={18}
                                className="text-mint"
                            />
                            <span className="text-sm text-slate-300">
                                Fast Support Response
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Send
                                size={18}
                                className="text-mint"
                            />
                            <span className="text-sm text-slate-300">
                                Usually replies within 24 hours
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="glass rounded-xl p-5"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="field"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="field"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-1 block text-sm">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            className="field"
                            placeholder="Enter subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-1 block text-sm">
                            Message
                        </label>
                        <textarea
                            rows="6"
                            name="message"
                            className="field resize-none"
                            placeholder="Describe your issue or question..."
                            value={form.message}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary mt-5 w-full md:w-auto"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;