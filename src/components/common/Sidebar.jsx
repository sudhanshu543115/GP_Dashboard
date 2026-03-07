import React, { useEffect , useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { ChevronDown, ChevronRight, LogOut, Hexagon, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SIDEBAR_CONFIG } from "../../config/sidebar.config";
import { ROLE_ACCESS } from "../../config/roles.map";


const Sidebar = ({ className, isMobileOpen, onMobileClose, onCollapseChange }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [hoverExpanded, setHoverExpanded] = React.useState(false);
  const sidebarRef = React.useRef(null);


  // Handle both direct user object and nested user structure
  const actualUser = user?.user || user;
  const userRole = actualUser?.role;
  
  // Normalize role key to match ROLE_ACCESS keys
  const normalizedRole = userRole ? userRole.toUpperCase().replace("-", "_") : "ADMIN";
  const allowedKeys = ROLE_ACCESS[normalizedRole] || [];

  const hasAccess = (key) => {
    if (allowedKeys.includes("*")) return true;
    return allowedKeys.includes(key);
  };

  const filteredSidebar = SIDEBAR_CONFIG.filter((item) =>
    hasAccess(item.key)
  );

  const groupedSections = filteredSidebar.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
     // Notify parent about collapse state change
    setIsExpanded(newExpandedState);
    setHoverExpanded(false);
    if (onCollapseChange) {
      onCollapseChange(!newExpandedState); 
      // setIsCollapsed(true)// true means collapsed
    }
  };

  // Notify parent of initial state
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(!isExpanded);
    }
  }, []); // Empty dependency array - only run once on mount

  // Handle mouse enter/leave for hover expansion
  const handleMouseEnter = () => {
    if (!isExpanded) {
      setHoverExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      setHoverExpanded(false);
      // Close all submenus when collapsing
      setOpenMenus({});
    }
  };

  // Close mobile sidebar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onMobileClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, onMobileClose]);

  // Determine if sidebar should be expanded (either permanently or via hover)
  const showExpanded = isExpanded || hoverExpanded;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={twMerge(
          "fixed left-0 top-0 h-screen bg-dark-850 border-r border-dark-600/30 flex flex-col transition-all duration-300 z-50",
          // Mobile styles
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Width based on expanded/collapsed state
          showExpanded ? "w-64" : "w-20",
          className
        )}
      >
        {/* Header */}
        <div className={twMerge(
          "p-4 flex items-center border-b border-dark-600/30",
          showExpanded ? "justify-between" : "justify-center"
        )}>
          {showExpanded ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                  <Hexagon className="w-4 h-4 text-dark-950" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-sm font-bold text-text-primary block whitespace-nowrap">
                    GLOBAL
                  </span>
                  <span className="text-[8px] text-text-muted uppercase block">
                    Admin Panel
                  </span>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-dark-700 rounded-lg hidden md:block text-text-muted hover:text-text-primary transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-dark-950" />
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-dark-700 rounded-lg hidden md:block absolute -right-10 top-4 bg-dark-850 border border-dark-600/30 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Expand sidebar"
              >
                <Menu size={16} />
              </button>
            </>
          )}

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="p-1 hover:bg-dark-700 rounded-lg md:hidden text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4 scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
          {Object.entries(groupedSections).map(([section, items]) => (
            <div key={section}>
              {showExpanded && (
                <h3 className="text-xs text-text-muted font-bold uppercase px-2 mb-2">
                  {section}
                </h3>
              )}

              {items.map((item) => {
                if (item.type === "item") {
                  return (
                    <NavLink
                      key={item.key}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 768) onMobileClose();
                      }}
                      className={({ isActive }) =>
                        twMerge(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition relative group",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text-muted hover:text-text-primary hover:bg-dark-700",
                          !showExpanded && "justify-center"
                        )
                      }
                      title={!showExpanded ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {showExpanded && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {!showExpanded && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition whitespace-nowrap z-50 border border-dark-600/30 shadow-xl">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                }

                if (item.type === "menu") {
                  const isOpen = openMenus[item.label];

                  return (
                    <div key={item.key}>
                      <button
                        onClick={() => {
                          if (showExpanded) {
                            toggleMenu(item.label);
                          } else {
                            // If collapsed, expand on hover and open menu
                            setHoverExpanded(true);
                            setTimeout(() => toggleMenu(item.label), 100);
                          }
                        }}
                        className={twMerge(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-dark-700 rounded-lg relative group",
                          !showExpanded && "justify-center"
                        )}
                        title={!showExpanded ? item.label : undefined}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {showExpanded && (
                          <>
                            <span className="flex-1 text-left whitespace-nowrap">
                              {item.label}
                            </span>
                            {isOpen ? (
                              <ChevronDown size={14} className="transition-transform" />
                            ) : (
                              <ChevronRight size={14} className="transition-transform" />
                            )}
                          </>
                        )}

                        {/* Tooltip for collapsed state */}
                        {!showExpanded && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition whitespace-nowrap z-50 border border-dark-600/30 shadow-xl">
                            {item.label}
                          </div>
                        )}
                      </button>

                      {showExpanded && isOpen && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.key}
                              to={child.path}
                              onClick={() => {
                                if (window.innerWidth < 768) onMobileClose();
                              }}
                              className={({ isActive }) =>
                                twMerge(
                                  "flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition",
                                  isActive
                                    ? "text-primary bg-primary/5"
                                    : "text-text-muted hover:text-text-primary hover:bg-dark-700"
                                )
                              }
                            >
                              <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">{child.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-dark-600/30">
          <button
            onClick={logout}
            className={twMerge(
              "flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg relative group transition-colors",
              !showExpanded && "justify-center"
            )}
            title={!showExpanded ? "Sign Out" : undefined}
          >
            <LogOut size={16} />
            {showExpanded && <span>Sign Out</span>}
            
            {/* Tooltip for collapsed state */}
            {!showExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition whitespace-nowrap z-50 border border-dark-600/30 shadow-xl">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;