import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { twMerge } from 'tailwind-merge';

const MainLayout = () => {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        // Load saved preference
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? saved === 'true' : false;
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Close mobile sidebar on resize to desktop
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Save sidebar state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleSidebarToggle = (collapsed) => {
        setIsSidebarCollapsed(collapsed);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-dark-950 dark:from-dark-950 light:from-light-50 via-dark-900 dark:via-dark-900 light:via-light-100 to-dark-950 dark:to-dark-950 light:to-light-50">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 dark:from-dark-950 light:from-light-50 via-dark-900 dark:via-dark-900 light:via-light-100 to-dark-950 dark:to-dark-950 light:to-light-50">
            {/* Navbar */}
            <Navbar 
                onMenuClick={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            <div className="flex w-full">
                {/* Sidebar */}
                <Sidebar 
                    isMobileOpen={isSidebarOpen}
                    onMobileClose={closeSidebar}
                    onCollapseChange={handleSidebarToggle}
                />

                {/* Main Content Area - Responsive to Navbar alignment */}
                <main 
                    className={twMerge(
                        "flex-1 min-h-screen transition-all duration-300 ease-in-out",
                        // Add padding top for navbar (h-20 = 5rem = 80px)
                        "pt-20",
                        // Desktop: account for sidebar width transitions
                        isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
                        // Blur effect when sidebar is open on mobile
                        isMobile && isSidebarOpen && "overflow-hidden h-screen"
                    )}
                >
                    {/* Content Container - Responsive with navbar */}
                    <div className={twMerge(
                        "h-full transition-all duration-300",
                        // Responsive padding: mobile-first
                        "p-3 sm:p-4 md:p-6 lg:p-8",
                        // Content max-width for readability
                        "max-w-7xl mx-auto w-full"
                    )}>
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={closeSidebar}
                />
            )}
        </div>
    );
};

export default MainLayout;