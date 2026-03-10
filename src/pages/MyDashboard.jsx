import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  Database,
  PieChart,
  ChevronRight,
  Users,
  Activity
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import useAuthStore from "@/store/authStore.js";
import AppwriteAccount from "../appwrite/Account.services";

const appwriteAccount = new AppwriteAccount();

const MyDashboard = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogOut() {
    setIsLoggingOut(true);
    try {
      await appwriteAccount.logout();
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard", gradient: "from-violet-500 to-indigo-600" },
    { name: "Domains List", icon: BookOpen, path: "/dashboard/alldomains", gradient: "from-blue-500 to-cyan-500" },
    { name: "Seed Data", icon: Database, path: "/user/seed-data", gradient: "from-emerald-500 to-teal-500" },
    { name: "User Growth", icon: Users, path: "/dashboard/analytics", gradient: "from-amber-400 to-rose-500" },
    { name: "Platform Stats", icon: Activity, path: "/dashboard/stats", gradient: "from-fuchsia-500 to-pink-600" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings", gradient: "from-slate-600 to-slate-800" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-inter">
      {/* Premium Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white border-r border-slate-100 flex flex-col relative z-50 transition-all duration-300"
      >
        {/* Branding Section */}
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight italic">Admin</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-600 mt-1">Central Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center justify-between px-5 py-4 rounded-[1.25rem] group transition-all duration-300 ${active
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${active
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-indigo-100`
                      : "bg-slate-50 group-hover:bg-white group-hover:shadow-md"}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-black tracking-tight uppercase ${active ? "text-slate-900" : "group-hover:text-slate-900"}`}>
                      {item.name}
                    </span>
                  </div>
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logout Area */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {isLoggingOut ? (
                <motion.div
                  key="logging-out"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-5 h-5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Destroying Session...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminate Access</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Content Explorer Section */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-50/30 to-transparent rounded-full -mr-64 -mt-64 blur-3xl pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-50/30 to-transparent rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none opacity-50" />

        <div className="relative z-10 max-w-[1500px] mx-auto p-12 lg:p-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MyDashboard;