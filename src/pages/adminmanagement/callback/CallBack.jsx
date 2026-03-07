import React, { useState } from 'react';
import { Phone, User, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const CallBack = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl shadow-xl border border-dark-600/50 animate-scale-up max-w-lg mx-auto mt-20 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-bounce relative z-10 border border-primary/30">
                    <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-text-primary relative z-10">Request Sent!</h2>
                <p className="text-text-muted relative z-10">Our team will contact you shortly. Usually within 30 minutes.</p>
                <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:bg-primary-dark transition-all active:scale-95 relative z-10">
                    Request Another
                </button>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-2 gap-12 bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl shadow-xl border border-dark-600/50 overflow-hidden animate-slide-in p-8 lg:p-12 items-center relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Visual Side */}
            <div className="hidden lg:block space-y-8 pr-8 relative z-10">
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <h1 className="text-5xl font-extrabold text-text-primary leading-tight">
                        Let's Talk About Your <span className="text-yellow">Project</span>
                    </h1>
                    <p className="text-lg text-text-muted mt-6 leading-relaxed">
                        Need expert advice? Request a callback and our senior consultants will get in touch with you to discuss your requirements.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-2xl border border-dark-600/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/30">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-primary">Fast Response</h3>
                            <p className="text-sm text-text-muted">We usually respond within 30 mins.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-2xl border border-dark-600/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-yellow/20 text-yellow rounded-xl flex items-center justify-center border border-yellow/30">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-primary">24/7 Support</h3>
                            <p className="text-sm text-text-muted">Our support lines are always open.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-dark-900/50 p-8 rounded-2xl border border-dark-600/50 relative backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Phone className="w-32 h-32 text-primary rotate-12" />
                </div>

                <h2 className="text-2xl font-bold text-text-primary mb-6 relative z-10">Request Callback</h2>

                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-text-muted ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary placeholder:text-text-muted"
                        />
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-text-muted ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="tel"
                            required
                            placeholder="+91 9211532100"
                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary placeholder:text-text-muted"
                        />
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-text-muted ml-1">Topic</label>
                    <select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary">
                        <option className="bg-dark-800">General Inquiry</option>
                        <option className="bg-dark-800">Technical Support</option>
                        <option className="bg-dark-800">Sales</option>
                        <option className="bg-dark-800">Partnership</option>
                        <option className="bg-dark-800">Project Inquiry</option>
                    </select>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-sm font-medium text-text-muted ml-1">Message (Optional)</label>
                    <div className="relative group">
                        <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <textarea
                            rows="3"
                            placeholder="How can we help?"
                            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none resize-none text-text-primary placeholder:text-text-muted"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:from-primary-dark hover:to-primary transition-all duration-300 relative z-10 font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                    {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <>Submit Request <Send className="w-4 h-4" /></>}
                </button>
            </form>
        </div>
    );
};

export default CallBack;

