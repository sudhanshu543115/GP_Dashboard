import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, User, LogOut, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { twMerge } from 'tailwind-merge';
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useZoom } from "../../context/ZoomContext";
const Navbar = ({ onMenuClick, isSidebarCollapsed }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
      const { zoomIn, zoomOut, resetZoom, zoom } = useZoom();

    
    const actualUser = user?.user || user;
    const userName = actualUser?.name;
    const userRole = actualUser?.role;
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={twMerge(
            "fixed top-0 h-20 z-40 transition-all duration-500 ease-out",
            "left-0 right-0 md:left-auto md:right-0",
            isSidebarCollapsed ? "md:left-20" : "md:left-64"
        )}>
            <div className="relative h-full w-full px-4 md:px-8 flex items-center justify-between bg-gradient-to-r from-dark-900 to-dark-800/95 backdrop-blur-xl border-b border-dark-600/20 shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:pointer-events-none">
                
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                
                {/* Left section */}
                <div className="flex items-center flex-1 gap-4 min-w-0 relative z-10">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="relative p-2.5 rounded-xl bg-dark-800/80 border border-dark-600/30 hover:border-primary/50 text-text-muted hover:text-text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95 group md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                        <span className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    </button>

                    {/* Welcome Text */}
                    <div className="hidden lg:block">
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-text-primary to-text-primary/80 bg-clip-text">
                            Welcome back, {userName || 'Admin'}
                        </h2>
                        <p className="text-xs text-text-muted/80 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>

                    {/* Search Bar */}
                    {/* <div className="flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50 transition-all duration-300 group-hover:text-primary group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-11 pr-4 py-2.5 bg-dark-800/50 border border-dark-600/30 rounded-xl text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:bg-dark-800/70 hover:border-dark-600/50"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
                    </div> */}

                  

                </div>

                {/* Right section */}
                <div className="flex items-center gap-2 relative z-10">

                    {/* Zoom Controls */}
<div className="flex items-center bg-dark-800/80 border border-dark-600/30 rounded-xl overflow-hidden backdrop-blur-xl">
    <button
        onClick={zoomOut}
        className="p-2 hover:bg-dark-700/80 hover:text-primary transition-all duration-300"
        title="Zoom Out"
    >
        <ZoomOut className="w-4 h-4 text-text-muted" />
    </button>

    <span className="px-2 text-xs text-text-muted min-w-[40px] text-center">
        {zoom}%
    </span>

    <button
        onClick={zoomIn}
        className="p-2 hover:bg-dark-700/80 hover:text-primary transition-all duration-300"
        title="Zoom In"
    >
        <ZoomIn className="w-4 h-4 text-text-muted" />
    </button>

    <button
        onClick={resetZoom}
        className="p-2 hover:bg-dark-700/80 hover:text-yellow-400 transition-all duration-300"
        title="Reset Zoom"
    >
        <RotateCcw className="w-4 h-4 text-text-muted" />
    </button>
</div>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="relative p-2.5 rounded-xl bg-dark-800/80 border border-dark-600/30 hover:border-primary/50 hover:bg-dark-700/80 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95 group"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'light' ? 
                            <Moon className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:text-primary group-hover:rotate-12" /> : 
                            <Sun className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:text-primary group-hover:rotate-90" />
                        }
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl bg-dark-800/80 border border-dark-600/30 hover:border-primary/50 hover:bg-dark-700/80 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95 group">
                        <Bell className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:text-primary group-hover:rotate-12" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5">
                            <span className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                            <span className="relative block w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-dark-900/50" />
                        </span>
                    </button>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl bg-dark-800/80 border border-dark-600/30 hover:border-primary/50 hover:bg-dark-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-yellow-DEFAULT flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <span className="text-base font-bold text-dark-950 drop-shadow-md">
                                        {userName?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-dark-900" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">
                                    {userName || 'Admin User'}
                                </p>
                                <p className="text-xs text-text-muted/80 group-hover:text-text-muted transition-colors duration-300">
                                    {userRole || 'Administrator'}
                                </p>
                            </div>
                            <ChevronDown className={twMerge(
                                "w-4 h-4 text-text-muted/80 transition-all duration-500 group-hover:text-primary",
                                isProfileOpen ? "rotate-180 translate-y-0.5" : "group-hover:translate-y-0.5"
                            )} />
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-dark-800/95 backdrop-blur-xl border border-dark-600/30 rounded-2xl shadow-2xl py-2 z-50 animate-dropdown origin-top-right">
                                <div className="px-4 py-3 border-b border-dark-600/30">
                                    <p className="text-sm font-semibold text-text-primary">{userName || 'Admin User'}</p>
                                    <p className="text-xs text-text-muted/80 mt-0.5">{userRole || 'Administrator'}</p>
                                </div>
                                
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-dark-700/80 hover:text-text-primary transition-all duration-200 group">
                                    <User className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                                    <span>Profile</span>
                                </button>
                                
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-dark-700/80 hover:text-text-primary transition-all duration-200 group">
                                    <Settings className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                                    <span>Settings</span>
                                </button>
                                
                                <div className="my-2 border-t border-dark-600/30" />
                                
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                                >
                                    <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;