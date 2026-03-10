import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Bot,
    Award,
    LogOut,
    User,
    ChevronRight,
    ChevronLeft,
    Library,
    Sparkles,
    Zap,
    Menu,
    X,
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

    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Close mobile drawer on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    useEffect(() => { loadUser(); }, []);

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
            setCurrentUser(null);
            setIsCheckingUser(false);
            toast.success("Logged out successfully");
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Failed to logout");
        }
    };

    const navItems = [
        { name: "Overview", path: "/user", icon: LayoutDashboard, color: "from-blue-400 to-indigo-500" },
        { name: "Domains", path: "/user/domains", icon: BookOpen, color: "from-violet-400 to-purple-500" },
        { name: "Progress", path: "/user/progress", icon: TrendingUp, color: "from-emerald-400 to-teal-500" },
        { name: "Study Materials", path: "/user/study-materials", icon: Library, color: "from-cyan-400 to-blue-500" },
        { name: "AI Assistant", path: "/user/ai-assistant", icon: Bot, color: "from-pink-400 to-rose-500" },
        { name: "Certificates", path: "/user/certificates", icon: Award, color: "from-amber-400 to-orange-500" },
        { name: "Profile", path: "/user/profile", icon: User, color: "from-indigo-400 to-blue-500" },
    ];

    const isActive = (path) => {
        if (path === "/user") return location.pathname === "/user";
        return location.pathname.startsWith(path);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    // Shared sidebar body (used in both mobile drawer and desktop)
    const SidebarBody = ({ expanded }) => (
        <>
            <div className="absolute top-0 left-0 w-full h-48 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(100,80,255,0.18) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />

            {/* Logo */}
            <div className={`relative z-10 flex items-center gap-3 border-b border-white/10 flex-shrink-0 ${expanded ? 'px-5 py-5' : 'px-3 py-5 justify-center'}`}>
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 relative shadow-xl"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                >
                    <Sparkles className="w-5 h-5 text-white" />
                    <div className="absolute inset-0 rounded-2xl opacity-40"
                        style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)" }} />
                </motion.div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                        >
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">
                                Skill<span style={{ color: "#a78bfa" }}>Forge</span>
                            </h1>
                            <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-widest mt-0.5">AI Platform</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className={`relative z-10 flex-shrink-0 ${expanded ? 'px-4 py-4' : 'px-2 py-4 flex justify-center'}`}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden ${expanded ? 'p-3' : 'p-0'}`}
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    <div className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'}`}>
                        <div className="relative flex-shrink-0">
                            <div
                                className={`rounded-full flex items-center justify-center text-white font-black shadow-xl flex-shrink-0 ${expanded ? 'w-11 h-11 text-base' : 'w-10 h-10 text-sm'}`}
                                style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
                            >
                                {loading ? "·" : getInitials(user?.name || "U")}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1a1040]" />
                        </div>
                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0"
                                >
                                    <h3 className="font-bold text-white truncate text-sm leading-tight">
                                        {loading ? "Loading..." : user?.name || "User"}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                                        <p className="text-[10px] text-indigo-300 font-semibold truncate">Active Learner</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                                className="mt-3"
                            >
                                <Link
                                    to="/user/profile"
                                    className="flex items-center justify-between text-[11px] font-bold px-3 py-2 rounded-xl transition-all group"
                                    style={{ background: "rgba(99,102,241,0.15)", color: "#a78bfa" }}
                                >
                                    <span>View Profile</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-2 ${expanded ? 'px-3' : 'px-2'}`}
                style={{ scrollbarWidth: "none" }}
            >
                {expanded && (
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400/60 px-2 mb-2">Navigation</p>
                )}
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ x: expanded ? 3 : 0, scale: !expanded ? 1.05 : 1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative flex items-center rounded-xl transition-all duration-200 cursor-pointer ${expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5'}`}
                                    style={active ? {
                                        background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%)",
                                        border: "1px solid rgba(99,102,241,0.35)",
                                    } : { border: "1px solid transparent" }}
                                    title={!expanded ? item.name : ""}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                            style={{ background: "linear-gradient(180deg, #6366f1, #a855f7)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <div className={`rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${expanded ? 'w-8 h-8' : 'w-10 h-10'} ${active ? `bg-gradient-to-br ${item.color} shadow-lg` : 'bg-white/5 hover:bg-white/10'}`}>
                                        <Icon className={`${expanded ? 'w-4 h-4' : 'w-5 h-5'} ${active ? 'text-white' : 'text-slate-400'}`} />
                                    </div>
                                    <AnimatePresence>
                                        {expanded && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                                                className={`text-sm font-semibold whitespace-nowrap ${active ? 'text-white' : 'text-slate-400'}`}
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout */}
            <div className={`relative z-10 flex-shrink-0 border-t border-white/10 ${expanded ? 'p-3' : 'p-2'}`}>
                <motion.button
                    whileHover={{ scale: expanded ? 1.02 : 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className={`w-full flex items-center rounded-xl transition-all group cursor-pointer ${expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5'}`}
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                    title={!expanded ? "Logout" : ""}
                >
                    <div className={`rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${expanded ? 'w-8 h-8' : 'w-10 h-10'} bg-red-500/15 group-hover:bg-red-500/25`}>
                        <LogOut className={`${expanded ? 'w-4 h-4' : 'w-5 h-5'} text-red-400`} />
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.span
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                                className="text-sm font-semibold text-red-400 whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </>
    );

    // ── MOBILE ───────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <>
                {/* Floating hamburger */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="fixed top-4 left-4 z-50 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                    <Menu className="w-5 h-5 text-white" />
                </button>

                {/* Backdrop */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            key="bd"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.aside
                            key="drawer"
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 h-screen w-72 flex flex-col z-50 overflow-hidden"
                            style={{ background: "linear-gradient(180deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)", boxShadow: "4px 0 30px rgba(0,0,0,0.5)" }}
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                            <SidebarBody expanded={true} />
                        </motion.aside>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ── DESKTOP ──────────────────────────────────────────────────────
    return (
        <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1, width: isExpanded ? 268 : 76 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-screen flex flex-col z-50 overflow-hidden"
            style={{ background: "linear-gradient(180deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)", boxShadow: "4px 0 30px rgba(0,0,0,0.4)" }}
        >
            <motion.button
                whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(99,102,241,0.6)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3.5 top-8 w-7 h-7 rounded-full flex items-center justify-center z-50 border border-indigo-500/40"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
                <motion.div animate={{ rotate: isExpanded ? 0 : 180 }} transition={{ duration: 0.3 }}>
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </motion.div>
            </motion.button>
            <SidebarBody expanded={isExpanded} />
        </motion.aside>
    );
};

export default Sidebar;
