import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Bot,
    Award,
    Settings,
    LogOut,
    User,
    ChevronRight,
    ChevronLeft,
    Menu,
    Library
} from "lucide-react";
import AppwriteAccount from "@/appwrite/Account.services";
import { toast } from "sonner";
import { useSidebar } from "@/pages/user/UserLayout";
import useAuthStore from "@/store/authStore";

const account = new AppwriteAccount();

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isExpanded, setIsExpanded } = useSidebar();
    const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
    const setIsCheckingUser = useAuthStore((state) => state.setIsCheckingUser);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await account.getAppwriteUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await account.logout();
            setCurrentUser(null);      // Clear user from Zustand store
            setIsCheckingUser(false);  // Ensure not stuck in loading
            toast.success("Logged out successfully");
            // Use window.location.href to fully reload and clear all state
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Failed to logout");
        }
    };

    const navItems = [
        {
            name: "Overview",
            path: "/user",
            icon: LayoutDashboard,
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            name: "Domains",
            path: "/user/domains",
            icon: BookOpen,
            gradient: "from-purple-500 to-pink-500"
        },
        {
            name: "Progress",
            path: "/user/progress",
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500"
        },
        {
            name: "Study Materials",
            path: "/user/study-materials",
            icon: Library,
            gradient: "from-teal-500 to-cyan-500"
        },
        {
            name: "AI Assistant",
            path: "/user/ai-assistant",
            icon: Bot,
            gradient: "from-orange-500 to-red-500"
        },
        {
            name: "Certificates",
            path: "/user/certificates",
            icon: Award,
            gradient: "from-yellow-500 to-amber-500"
        },
        {
            name: "Profile",
            path: "/user/profile",
            icon: User,
            gradient: "from-indigo-500 to-purple-500"
        },
        {
            name: "Settings",
            path: "/user/settings",
            icon: Settings,
            gradient: "from-slate-500 to-gray-500"
        }
    ];

    const isActive = (path) => {
        if (path === "/user") {
            return location.pathname === "/user";
        }
        return location.pathname.startsWith(path);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                width: isExpanded ? 270 : 80
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 shadow-lg"
        >
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-4 top-8 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
            >
                <motion.div
                    animate={{ rotate: isExpanded ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </motion.div>
            </motion.button>

            {/* Logo/Brand */}
            <div className={`p-6 border-b border-slate-200 ${!isExpanded && 'px-4'}`}>
                <Link to="/user" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">SF</span>
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="text-lg font-bold text-slate-900 whitespace-nowrap">SkillForge</h1>
                                <p className="text-xs text-slate-500 whitespace-nowrap">Learn & Build</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Profile Section */}
            <div className={`p-4 ${!isExpanded && 'px-2'}`}>
                <motion.div
                    whileHover={{ scale: isExpanded ? 1.02 : 1.05 }}
                    className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 ${isExpanded ? 'p-4' : 'p-2'
                        }`}
                >
                    <div className={`flex items-center ${isExpanded ? 'gap-3 mb-3' : 'justify-center'}`}>
                        <div className={`rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ${isExpanded ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm'
                            }`}>
                            {loading ? "..." : getInitials(user?.name || "User")}
                        </div>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0"
                                >
                                    <h3 className="font-bold text-slate-900 truncate text-sm">
                                        {loading ? "Loading..." : user?.name || "User"}
                                    </h3>
                                    <p className="text-xs text-slate-600">MERN Stack Learner</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    to="/user/profile"
                                    className="flex items-center justify-between text-xs text-blue-600 hover:text-blue-700 font-semibold group"
                                >
                                    <span>View Profile</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Navigation Items */}
            <nav className={`flex-1 py-2 overflow-y-auto ${isExpanded ? 'px-4' : 'px-2'}`}>
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ x: isExpanded ? 4 : 0, scale: !isExpanded ? 1.05 : 1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        relative flex items-center rounded-xl
                                        transition-all duration-200 group
                                        ${isExpanded ? 'gap-3 px-4 py-3' : 'justify-center py-3'}
                                        ${active
                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }
                                    `}
                                    title={!isExpanded ? item.name : ""}
                                >
                                    {/* Active Indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon with gradient on active */}
                                    <div className={`
                                        rounded-lg flex items-center justify-center flex-shrink-0
                                        transition-all duration-200
                                        ${isExpanded ? 'w-9 h-9' : 'w-10 h-10'}
                                        ${active
                                            ? `bg-gradient-to-br ${item.gradient}`
                                            : "bg-slate-100 group-hover:bg-slate-200"
                                        }
                                    `}>
                                        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-600"}`} />
                                    </div>

                                    {/* Label */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`font-semibold whitespace-nowrap ${active ? "text-blue-700" : "text-slate-700"}`}
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Hover glow effect */}
                                    {!active && (
                                        <motion.div
                                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                background: `linear-gradient(to right, transparent, ${item.gradient.split(" ")[1]}10, transparent)`
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className={`p-4 border-t border-slate-200 ${!isExpanded && 'px-2'}`}>
                <motion.button
                    whileHover={{ scale: isExpanded ? 1.02 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className={`w-full flex items-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors group ${isExpanded ? 'gap-3 px-4 py-3' : 'justify-center py-3'
                        }`}
                    title={!isExpanded ? "Logout" : ""}
                >
                    <div className={`rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-colors flex-shrink-0 ${isExpanded ? 'w-9 h-9' : 'w-10 h-10'
                        }`}>
                        <LogOut className="w-5 h-5" />
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-semibold whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
