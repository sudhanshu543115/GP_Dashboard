import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, ArrowUp, BookOpen, Tag, Eye } from "lucide-react";

const BlogCard = ({ post, index, isExpanded, onExpand }) => {
    const [isHovered, setIsHovered] = useState(false);

    const categoryColors = {
        OUTSOURCING: "from-primary/80 to-pink-500",
        TECHNOLOGY: "from-primary to-cyan-500",
        "CASE STUDY": "from-emerald-500 to-teal-500",
        SECURITY: "from-amber-500 to-orange-500",
    };

    const categoryColor = categoryColors[post?.category] || "from-primary to-primary/80";

    const handleToggle = (e) => {
        e?.stopPropagation();
        onExpand();
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            layout
            className={`group relative bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 ${
                isExpanded ? 'md:col-span-2 lg:col-span-3 row-span-2' : ''
            }`}
        >
            {/* Main Content Container */}
            <div className="relative">
                {/* Image Container */}
                <div className={`relative overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'h-64 md:h-80' : 'h-48'
                }`}>
                    <img
                        src={post?.featuredImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                        alt={post?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/20 to-transparent opacity-60" />
                    
                    {/* Category Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor} text-white text-xs font-semibold shadow-lg z-10`}>
                        {post?.category || "TECHNOLOGY"}
                    </div>

                    {/* Reading Time Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1 shadow-lg z-10">
                        <Clock className="w-3 h-3" />
                        <span>5 min read</span>
                    </div>

                    {/* Expand/Collapse Indicator */}
                    <motion.div 
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-2 cursor-pointer z-20"
                        onClick={handleToggle}
                    >
                        <BookOpen className={`w-4 h-4 text-white transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                        }`} />
                    </motion.div>
                </div>

                {/* Content Container */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className={`font-bold text-text-primary group-hover:text-primary transition-colors ${
                        isExpanded ? 'text-2xl mb-3' : 'text-xl mb-2'
                    }`}>
                        {post?.title}
                    </h3>
                    
                    {/* Preview or Full Content */}
                    <AnimatePresence mode="wait">
                        {!isExpanded ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <p className="text-text-muted text-sm line-clamp-3">
                                    {post?.excerpt || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                                </p>

                                {/* Author & Date - Preview */}
                                <div className="flex items-center justify-between pt-4 border-t border-dark-600/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">
                                                {post?.author?.name?.charAt(0) || "A"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{post?.author?.name || "Anonymous"}</p>
                                            <p className="text-xs text-text-muted/70 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post?.createdAt 
                                                    ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                    : "Recent"
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ x: 5 }}
                                        onClick={handleToggle}
                                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm"
                                    >
                                        Read More
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Full Content */}
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-text-secondary leading-relaxed">
                                        {post?.content || post?.excerpt || 
                                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                                        }
                                    </p>
                                    
                                    {/* Additional Content Sections */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-dark-700/30 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                Key Topics
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Strategy', 'Implementation', 'Best Practices'].map((topic, i) => (
                                                    <span key={i} className="px-2 py-1 bg-dark-600/50 rounded-md text-xs text-text-muted">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-dark-700/30 rounded-xl p-4">
                                            <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Stats
                                            </h4>
                                            <div className="space-y-1">
                                                <p className="text-xs text-text-muted">Views: <span className="text-text-primary">1.2k</span></p>
                                                <p className="text-xs text-text-muted">Likes: <span className="text-text-primary">156</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Author Details - Expanded */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">
                                                    {post?.author?.name?.charAt(0) || "A"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-text-primary font-semibold">{post?.author?.name || "Anonymous"}</p>
                                                <p className="text-xs text-text-muted">{post?.author?.role || "Guest Author"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-dark-600/30">
                                    <div className="flex items-center gap-3">
                                        <button className="px-3 py-1.5 bg-primary/20 rounded-lg text-primary text-sm font-medium hover:bg-primary/30 transition-colors">
                                            Like
                                        </button>
                                        <button className="px-3 py-1.5 bg-primary/80/20 rounded-lg text-purple-400 text-sm font-medium hover:bg-primary/80/30 transition-colors">
                                            Share
                                        </button>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleToggle}
                                        className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg text-text-primary text-sm font-medium hover:bg-dark-600 transition-colors"
                                    >
                                        Show Less
                                        <ArrowUp className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/0 via-transparent to-transparent group-hover:from-primary/5 pointer-events-none transition-all duration-300" />
        </motion.article>
    );
};

export default BlogCard;