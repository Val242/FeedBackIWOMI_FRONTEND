import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCommentDots, FaUsers } from "react-icons/fa";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { id: "feedbacks", label: "Feedback", path: "/admin/feedbacks", icon: <FaCommentDots /> },
    { id: "developers", label: "Developers", path: "/admin/developers", icon: <FaUsers /> },
  ];

  const renderTab = (tab, isCollapsed) => (
    <NavLink
      key={tab.id}
      to={tab.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-3 rounded-lg transition-all ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
            : "hover:bg-gray-200 text-gray-700"
        }`
      }
    >
      <span className="text-lg">{tab.icon}</span>
      {!isCollapsed && <span className="text-md font-medium">{tab.label}</span>}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col bg-white border-r shadow-lg"
      >
        <div className="flex items-center justify-between p-5 border-b">
          {!sidebarCollapsed && <span className="font-bold text-2xl">Admin</span>}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 flex flex-col px-2 py-4 space-y-3">
          {tabs.map((tab) => renderTab(tab, sidebarCollapsed))}
        </nav>

        <div className="p-5 border-t flex flex-col gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              👤
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-sm font-semibold">Admin</p>
                <button
                  className="text-xs text-red-500 underline mt-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black opacity-25"
            onClick={toggleMobileSidebar}
          ></div>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex flex-col w-64 bg-white border-r shadow-lg"
          >
            <div className="flex items-center justify-between p-5 border-b">
              <span className="font-bold text-lg">Admin</span>
              <button onClick={toggleMobileSidebar}>✕</button>
            </div>

            <nav className="flex-1 flex flex-col px-3 py-4 space-y-3">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
                        : "hover:bg-gray-200 text-gray-700"
                    }`
                  }
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-md font-medium">{tab.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-5 border-t flex flex-col gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  👤
                </div>
                <div>
                  <p className="text-sm font-semibold">Admin</p>
                  <button
                    className="text-xs text-red-500 underline mt-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-5 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={toggleMobileSidebar}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Desktop Title */}
        <h1 className="hidden md:block text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="space-y-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
