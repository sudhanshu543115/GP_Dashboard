import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    TrendingUp, PlusCircle, Search, 
    Calendar, User, Tag, Eye, 
    ChevronLeft, ChevronRight, X
} from "lucide-react";
import BlogEditor from "./Blogeditor";
import BlogCard from "./BlogCard";
import FeaturedBlog from "./FeaturedBlog";
import NewsletterSection from "./NewsletterSection";
import { useGetBlogsQuery, useAddBlogMutation } from "../../../redux/api/blogApiSlice";

const categories = [
    { id: "ALL", label: "All Posts", color: "from-primary to-primary/80" },
    { id: "OUTSOURCING", label: "Outsourcing", color: "from-primary/80 to-pink-500" },
    { id: "TECHNOLOGY", label: "Technology", color: "from-primary to-cyan-500" },
    { id: "CASE STUDY", label: "Case Studies", color: "from-emerald-500 to-teal-500" },
    { id: "SECURITY", label: "Security", color: "from-amber-500 to-orange-500" },
];

const Blogs = () => {
    const [showEditor, setShowEditor] = useState(false);
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const postsPerPage = 9;

    const {
        data: postsResponse,
        isLoading,
        isError,
        error,
    } = useGetBlogsQuery();

    const [addBlog, { isLoading: adding }] = useAddBlogMutation();

    const posts = postsResponse?.data || postsResponse?.blogs || postsResponse || [];

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesCategory = activeCategory === "ALL" || post.category === activeCategory;
            const matchesSearch = 
                post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, posts, searchTerm]);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const featuredPost = currentPosts[0];
    const recentPosts = currentPosts.slice(1);

    const handleCreateBlog = async (blogData) => {
        try {
            await addBlog(blogData).unwrap();
            setShowEditor(false);
        } catch (err) {
            alert(err?.data?.message || "Failed to create blog");
        }
    };

    const handleExpandPost = (postId) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-app-bg text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-muted">Loading amazing content...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-app-bg text-text-primary flex items-center justify-center">
                <div className="text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 max-w-md">
                    <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-10 h-10 text-rose-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Oops! Something went wrong</h2>
                    <p className="text-text-muted">{error?.data?.message || "Error loading blogs"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-bg text-text-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between lg:items-end gap-6"
                >
                    <div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent">
                            Knowledge Hub
                        </h1>
                        <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Industry insights, operational updates and strategy guides
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditor(true)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Create New Blog
                    </motion.button>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl p-4"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search posts by title, content or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600/50 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setExpandedPostId(null);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        activeCategory === cat.id
                                            ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                            : "bg-dark-900 border border-dark-600/50 text-text-muted hover:border-primary/50 hover:text-text-primary"
                                    }`}
                                >
                                    {cat.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Total Posts', value: posts.length, icon: Eye, color: 'from-primary to-primary/80' },
                        { label: 'Categories', value: categories.length - 1, icon: Tag, color: 'from-primary/80 to-pink-500' },
                        { label: 'Authors', value: new Set(posts.map(p => p.author?.name)).size, icon: User, color: 'from-emerald-500 to-teal-500' },
                        { label: 'This Month', value: posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: Calendar, color: 'from-amber-500 to-orange-500' },
                    ].map((stat, idx) => (
                        <div key={idx} className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
                            <div className="relative bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl p-4 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-text-muted text-xs">{stat.label}</p>
                                        <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg opacity-80`}>
                                        <stat.icon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    {filteredPosts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-12 h-12 text-text-muted/50" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">No posts found</h3>
                            <p className="text-text-muted">Try adjusting your search or filter</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {/* Featured Post */}
                            {featuredPost && (
                                <FeaturedBlog 
                                    post={featuredPost} 
                                    isExpanded={expandedPostId === featuredPost._id}
                                    onExpand={() => handleExpandPost(featuredPost._id)}
                                />
                            )}

                            {/* Blog Grid */}
                            {recentPosts.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                                    <AnimatePresence>
                                        {recentPosts.map((post, index) => (
                                            <BlogCard 
                                                key={post._id} 
                                                post={post} 
                                                index={index}
                                                isExpanded={expandedPostId === post._id}
                                                onExpand={() => handleExpandPost(post._id)}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between bg-dark-800/50 backdrop-blur-xl border border-dark-600/30 rounded-2xl p-4"
                    >
                        <div className="text-sm text-text-muted">
                            Showing {(currentPage - 1) * postsPerPage + 1} to {Math.min(currentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
                        </div>
                        
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(1, prev - 1));
                                    setExpandedPostId(null);
                                }}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border transition-colors ${
                                    currentPage === 1 
                                        ? "border-dark-600/30 bg-dark-800/50 text-text-muted/50 cursor-not-allowed" 
                                        : "border-dark-600/30 bg-dark-800 hover:bg-dark-700 text-text-muted"
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        setExpandedPostId(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                        currentPage === i + 1
                                            ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                                            : "bg-dark-800 text-text-muted hover:bg-dark-700"
                                    }`}
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                    setExpandedPostId(null);
                                }}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border transition-colors ${
                                    currentPage === totalPages 
                                        ? "border-dark-600/30 bg-dark-800/50 text-text-muted/50 cursor-not-allowed" 
                                        : "border-dark-600/30 bg-dark-800 hover:bg-dark-700 text-text-muted"
                                }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Newsletter Section */}
                <NewsletterSection />

                {/* Blog Editor Modal */}
                <AnimatePresence>
                    {showEditor && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                            onClick={() => setShowEditor(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-4xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <BlogEditor
                                    onClose={() => setShowEditor(false)}
                                    onSubmit={handleCreateBlog}
                                    loading={adding}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Blogs;