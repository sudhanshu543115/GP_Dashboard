import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Clock, ArrowRight, TrendingUp, ArrowUp } from "lucide-react";

const FeaturedBlog = ({ post }) => {
    const [showFullContent, setShowFullContent] = useState(false);

    const toggleContent = (e) => {
        e?.stopPropagation();
        setShowFullContent(!showFullContent);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
        >
            {/* Background Image with Overlay */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
                <img
                    src={post?.featuredImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                    alt={post?.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/80/20 mix-blend-overlay" />
                
                {/* Featured Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-sm font-semibold z-10">
                    <TrendingUp className="w-4 h-4" />
                    Featured Post
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/10 z-10">
                    {post?.category || "Technology"}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {post?.title}
                        </h2>
                        
                        {/* Preview or Full Content */}
                        <AnimatePresence mode="wait">
                            {!showFullContent ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <p className="text-lg text-slate-300">
                                        {post?.excerpt || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    {post?.author?.name?.charAt(0) || "A"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400">Author</p>
                                                <p className="text-white font-medium">{post?.author?.name || "Anonymous"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-sm text-slate-400">Published</p>
                                                <p className="text-white">
                                                    {post?.createdAt 
                                                        ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })
                                                        : "Recent"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-sm text-slate-400">Read Time</p>
                                                <p className="text-white">5 min read</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-slate-300 leading-relaxed">
                                            {post?.content || post?.excerpt || 
                                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                                            }
                                        </p>
                                        <p className="text-slate-300 leading-relaxed mt-4">
                                            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Read More / Show Less Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleContent}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
                        >
                            {showFullContent ? (
                                <>
                                    Show Less
                                    <ArrowUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Read Full Article
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ 
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop"
                                        }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturedBlog;