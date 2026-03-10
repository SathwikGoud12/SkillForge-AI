import { Outlet } from "react-router";
import { useState, createContext, useContext, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

const UserLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Sidebar />
        <div
          className="min-h-screen transition-all duration-300 ease-in-out"
          style={{ marginLeft: isMobile ? 0 : isExpanded ? '268px' : '76px' }}
        >
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default UserLayout;

