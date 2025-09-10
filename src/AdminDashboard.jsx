import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDev, setNewDev] = useState({ name: "", email: "", password: "", role: "" });
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  useEffect(() => {
    if (!token) window.location.replace("/#/admin");
  }, [token]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const fetchFeedbacks = async () => {
    try {
      if (!token) return;
      const { data } = await axios.get("http://localhost:3000/api/admin/feedback/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const fetchDevelopers = async () => {
    try {
      if (!token) return;
      const { data } = await axios.get("http://localhost:3000/api/admin/collaboratorRoute/collaborator", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevelopers(data);
    } catch (err) {
      console.error("Error fetching developers:", err);
    } finally {
      setLoadingDevelopers(false);
    }
  };

  const handleCreateDeveloper = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/registerdeveloper",
        newDev,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevelopers((prev) => [...prev, data]);
      setShowCreateModal(false);
      setNewDev({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Error creating developer:", err);
    }
  };

  const handleAssignFeedback = async (feedbackId, devId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/assign/feedbacks/assign/${feedbackId}`,
        { assignedTo: devId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === feedbackId ? { ...f, assignedTo: devId } : f))
      );
    } catch (err) {
      console.error("Error assigning feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchDevelopers();
  }, []);

  const totalFeedbacks = feedbacks.length;
  const assignedFeedbacks = feedbacks.filter((f) => f.assignedTo).length;
  const unassignedFeedbacks = totalFeedbacks - assignedFeedbacks;
  const totalDevelopers = developers.length;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.replace("/#/admin");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {/* Root div with dark mode */}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <motion.div
          animate={{ width: sidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            {!sidebarCollapsed && <span className="font-bold text-lg">Admin</span>}
            <button onClick={toggleSidebar}>{sidebarCollapsed ? "→" : "←"}</button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "feedback", label: "Feedback" },
              { id: "developers", label: "Developers" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white font-semibold"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-gray-700 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">👤</div>
            {!sidebarCollapsed && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Admin</p>
                <button className="text-xs text-red-500 underline" onClick={handleLogout}>
                  Logout
                </button>
                <button
                  className="text-xs text-gray-700 dark:text-gray-300 underline mt-1"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { label: "Total Feedbacks", value: totalFeedbacks },
                { label: "Assigned Feedbacks", value: assignedFeedbacks },
                { label: "Unassigned Feedbacks", value: unassignedFeedbacks },
                { label: "Total Developers", value: totalDevelopers },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
                >
                  <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Name", "Email", "Message", "Time", "Criticality", "Status", "Assigned To", "Image"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb, idx) => {
                    const assignedDev = developers.find((d) => d._id === fb.assignedTo);
                    return (
                      <tr key={fb._id || idx} className={idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                        <td className="px-6 py-4 text-sm">{fb.name}</td>
                        <td className="px-6 py-4 text-sm">{fb.email}</td>
                        <td className="px-6 py-4 text-sm">{fb.message}</td>
                        <td className="px-6 py-4 text-sm">{fb.timestamp}</td>
                        <td className="px-6 py-4 text-sm">{fb.criticality}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              fb.status === "New"
                                ? "bg-yellow-100 text-yellow-700"
                                : fb.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {fb.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={fb.assignedTo?._id || fb.assignedTo || ""}
                            onChange={(e) => handleAssignFeedback(fb._id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="">Unassigned</option>
                            {developers.map((dev) => (
                              <option key={dev._id} value={dev._id}>
                                {dev.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">{fb.image}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Developers Tab */}
          {activeTab === "developers" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Developers</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  + Create Developer
                </button>
              </div>

              {loadingDevelopers ? (
                <p>Loading developers...</p>
              ) : developers.length === 0 ? (
                <p>No developers found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {["Name", "Email", "Role"].map((head) => (
                          <th
                            key={head}
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {developers.map((dev, idx) => (
                        <tr key={dev._id || idx} className={idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                          <td className="px-6 py-4 text-sm">{dev.name}</td>
                          <td className="px-6 py-4 text-sm">{dev.email}</td>
                          <td className="px-6 py-4 text-sm">{dev.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Developer Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="absolute inset-0 backdrop-blur-sm"></div>
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg z-10"
              >
                <h2 className="text-xl font-bold mb-4">Create New Developer</h2>
                <form onSubmit={handleCreateDeveloper} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newDev.name}
                    onChange={(e) => setNewDev({ ...newDev, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newDev.email}
                    onChange={(e) => setNewDev({ ...newDev, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newDev.password}
                    onChange={(e) => setNewDev({ ...newDev, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newDev.role}
                    onChange={(e) => setNewDev({ ...newDev, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
