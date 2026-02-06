import { Outlet } from "react-router";
import { useState, createContext, useContext } from "react";
import Sidebar from "@/components/Sidebar";

// Create context for sidebar state
export const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const UserLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Dynamically shifted based on sidebar state */}
        <div
          className="min-h-screen transition-all duration-300 ease-in-out"
          style={{ marginLeft: isExpanded ? '270px' : '80px' }}
        >
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default UserLayout;
