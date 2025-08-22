/*
AdminDashboard.jsx
Description: Admin dashboard with sidebar, feedbacks, developers list, create developer modal, and assign feedback
*/

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // default tab
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [newDev, setNewDev] = useState({ name: "", email: "", password: "", role: "" });

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "http://localhost:3000/api/admin/feedback/feedbacks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Fetch developers
  const fetchDevelopers = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "http://localhost:3000/api/admin/collaboratorRoute/collaborator",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevelopers(response.data);
    } catch (err) {
      console.error("Error fetching developers:", err);
    } finally {
      setLoadingDevelopers(false);
    }
  };

  // Create new developer
  const handleCreateDeveloper = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/registerdeveloper",
        newDev,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevelopers((prev) => [...prev, response.data]);
      setShowCreateModal(false);
      setNewDev({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Error creating developer:", err);
    }
  };

  // Assign feedback to developer
  const handleAssignFeedback = async (feedbackId, devId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/assign/feedbacks/assign/${feedbackId}`,
        { assignedTo: devId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map(f => f._id === feedbackId ? { ...f, assignedTo: devId } : f)
      );
    } catch (err) {
      console.error("Error assigning feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchDevelopers();
  }, []);

  // Dashboard stats
  const totalFeedbacks = feedbacks.length;
  const assignedFeedbacks = feedbacks.filter(f => f.assignedTo).length;
  const unassignedFeedbacks = totalFeedbacks - assignedFeedbacks;
  const totalDevelopers = developers.length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? "w-20" : "w-64"} bg-white border-r transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && <span className="font-bold text-lg">Admin</span>}
          <button onClick={toggleSidebar}>{sidebarCollapsed ? "→" : "←"}</button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <button onClick={() => setActiveTab("dashboard")} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200">Dashboard</button>
          <button onClick={() => setActiveTab("feedback")} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200">Feedback</button>
          <button onClick={() => setActiveTab("developers")} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200">Developers</button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-200">Settings</button>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-sm font-medium">Admin</p>
                <button className="text-xs text-red-500 underline" onClick={() => { localStorage.removeItem("currentUser"); window.location.reload(); }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-bold">{totalFeedbacks}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Assigned Feedbacks</p>
              <p className="text-2xl font-bold">{assignedFeedbacks}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Unassigned Feedbacks</p>
              <p className="text-2xl font-bold">{unassignedFeedbacks}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Developers</p>
              <p className="text-2xl font-bold">{totalDevelopers}</p>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Name","Email","Message","Time","Status","Assigned To"].map(head => (
                    <th key={head} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, idx) => {
                  const assignedDev = developers.find(d => d._id === fb.assignedTo);
                  return (
                    <tr key={fb._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm text-gray-800">{fb.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{fb.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{fb.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{fb.timestamp}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          fb.status==="New"?"bg-yellow-100 text-yellow-700":
                          fb.status==="In Progress"?"bg-blue-100 text-blue-700":"bg-green-100 text-green-700"
                        }`}>{fb.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={fb.assignedTo || ""}
                          onChange={(e) => handleAssignFeedback(fb._id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="">Unassigned</option>
                          {developers.map(dev => (
                            <option key={dev._id} value={dev._id}>{dev.name}</option>
                          ))}
                        </select>
                      </td>
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
              <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Create Developer</button>
            </div>
            {loadingDevelopers ? (
              <p>Loading developers...</p>
            ) : developers.length === 0 ? (
              <p>No developers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Name","Email","Role"].map(head => (
                        <th key={head} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {developers.map((dev, idx) => (
                      <tr key={dev._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-sm text-gray-800">{dev.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{dev.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{dev.role}</td>
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
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg p-6 w-96 shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Create New Developer</h2>
            <form onSubmit={handleCreateDeveloper} className="space-y-4">
              <input type="text" placeholder="Name" value={newDev.name} onChange={e => setNewDev({...newDev, name: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              <input type="email" placeholder="Email" value={newDev.email} onChange={e => setNewDev({...newDev, email: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              <input type="password" placeholder="Password" value={newDev.password} onChange={e => setNewDev({...newDev, password: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              <input type="text" placeholder="Role" value={newDev.role} onChange={e => setNewDev({...newDev, role: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
