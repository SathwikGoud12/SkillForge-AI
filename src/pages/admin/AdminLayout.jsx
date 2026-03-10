import { Outlet, Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  Database,
  PieChart,
  ChevronRight,
  Users
} from "lucide-react";
import AppwriteAccount from "@/appwrite/Account.services";
import useAuthStore from "@/store/authStore";

const account = new AppwriteAccount();

const AdminLayout = () => {
  const location = useLocation();
  const { setCurrentUser, setIsCheckingUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await account.logout();
      setCurrentUser(null);
      setIsCheckingUser(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard", gradient: "from-violet-500 to-indigo-600" },
    { name: "All Domains", icon: BookOpen, path: "/dashboard/alldomains", gradient: "from-blue-500 to-cyan-500" },
    { name: "Seed Data", icon: Database, path: "/user/seed-data", gradient: "from-emerald-500 to-teal-500" },
    { name: "Analytics", icon: PieChart, path: "/dashboard/analytics", gradient: "from-amber-400 to-rose-500" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings", gradient: "from-slate-600 to-slate-800" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
        {/* Branding */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Admin Central</h1>
              <p className="text-[10px] uppercase tracking-widest font-black text-indigo-600">SkillForge Suite</p>
            </div>
          </div>
        </div>

        {/* Nav Section */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl group transition-all duration-300 ${active
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                      : "bg-slate-100 group-hover:bg-white group-hover:shadow-md"}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${active ? "text-slate-900" : "group-hover:text-slate-900"}`}>
                      {item.name}
                    </span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section / Logout */}
        <div className="p-6 border-t border-slate-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-rose-100 group-hover:bg-rose-200 rounded-xl flex items-center justify-center transition-colors">
              <LogOut className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">Log Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
