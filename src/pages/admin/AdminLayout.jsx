import { Outlet, Link } from "react-router";
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">SkillForge Admin</h1>

        <nav className="space-y-3">
          <Link to="/dashboard" className="block hover:text-purple-400">
            Overview
          </Link>
          <Link to="/dashboard/add-domain" className="block hover:text-purple-400">
            Add Domain
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
