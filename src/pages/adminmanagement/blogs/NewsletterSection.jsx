import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Mail, Send, CheckCircle } from "lucide-react";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-dark-600/30 overflow-hidden"
        >
            {/* Simple dot pattern background instead of inline SVG */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(156 163 175 / 0.1) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <TrendingUp className="w-48 h-48 text-primary/10" />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Stay in the loop
                    </h3>
                    <p className="text-slate-400 text-lg max-w-xl">
                        Join <span className="text-white font-semibold">500+</span> industry professionals receiving weekly insights, 
                        trends, and exclusive content.
                    </p>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm text-slate-400">Weekly newsletters</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-sm text-slate-400">No spam</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span className="text-sm text-slate-400">Unsubscribe anytime</span>
                        </div>
                    </div>
                </div>

                {/* Subscription Form */}
                <div className="w-full lg:w-auto">
                    {subscribed ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-6 py-4"
                        >
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Successfully subscribed!</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full sm:w-80 bg-dark-900 border border-dark-600/30 rounded-xl pl-10 pr-4 py-4 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Subscribe
                            </motion.button>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default NewsletterSection;