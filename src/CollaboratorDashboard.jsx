/*
Matricule: FE23A038
Chapter: Collaborator Dashboard
Exercise: Improved UI
*/

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function CollaboratorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [feedbackProgress, setFeedbackProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("all");

  const notificationsRef = useRef(null);

  // EmailJS function
  const sendFeedbackUpdateEmail = async (userEmail, userName, feedbackMessage, status) => {
    if (!userEmail) return;
    const templateParams = { user_name: userName, feedback_message: feedbackMessage, status, to_email: userEmail };
    try { await emailjs.send("service_euggmtc", "template_mnfnmll", templateParams, "rcq_HKvYYWWIDizAv"); }
    catch (err) { console.error("Error sending email:", err); }
  };

  // Fetch user & feedbacks
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser?.developerId) { navigate("/login", { replace: true }); return; }
    setUser(currentUser);

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/collaborator/feedbacks/${currentUser.developerId}`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
console.log(data)

        const feedbackArray = data.feedbacks || [];
        const statusMap = {};
        const progressMap = {};
        let total = feedbackArray.length, inProgress = 0, completed = 0, overdue = 0;

        feedbackArray.forEach((f) => {
          statusMap[f._id] = f.status || "New";
          progressMap[f._id] = f.progress || 0;
          switch (f.status) { case "In Progress": inProgress++; break; case "Completed": completed++; break; case "Overdue": overdue++; break; default: break; }
        });

        setFeedbackList(feedbackArray);
        setFeedbackStatus(statusMap);
        setFeedbackProgress(progressMap);
        setSummaryStats({ total, inProgress, completed, overdue });

        const notificationsArray = data.notifications || [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n) => !n.read).length);
      } catch (err) { console.error("Error fetching feedbacks:", err); }
      finally { setLoading(false); }
    };

    fetchFeedbacks();
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) { setUnreadCount(0); setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); }
  };

  const handleStatusFilterChange = (status) => setCurrentFilter(status);
const handleProgressChange = async (feedbackId, newProgress) => {
  // Update UI immediately
  setFeedbackProgress(prev => ({ ...prev, [feedbackId]: newProgress }));

  // Determine new status
  const newStatus = newProgress >= 100 ? "Completed" : newProgress > 0 ? "In Progress" : "New";
  setFeedbackStatus(prev => ({ ...prev, [feedbackId]: newStatus }));

  try {
    // Persist to backend
    const { data } = await axios.put(
      `http://localhost:3000/api/collaborator/feedbacks/feedbacks/${feedbackId}`,
      
      { progress: newProgress, status: newStatus },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    console.log("Backend updated:", data.feedback);
  } catch (err) {
    console.error("Error updating feedback:", err);
    console.log("Token:", user.token);
  }
};


  const filteredFeedbacks = feedbackList.filter(
    (f) => currentFilter === "all" || feedbackStatus[f._id] === currentFilter
  );

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-40 rounded-b-xl">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">👩‍💻 Hello, {user?.name}</h1>
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button onClick={toggleNotifications} className="relative text-2xl hover:scale-110 transition-transform">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg mt-3 z-50 animate-slideDown">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">No notifications</div>
                ) : notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-gray-700">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* User info */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[
          { key: "total", label: "Total Feedbacks", color: "blue", icon: "📊" },
          { key: "inProgress", label: "In Progress", color: "yellow", icon: "⏳" },
          { key: "completed", label: "Completed", color: "green", icon: "✅" },
          { key: "overdue", label: "Overdue", color: "red", icon: "⚠️" },
        ].map(({ key, label, color, icon }) => (
          <div key={key} className={`bg-gradient-to-r from-${color}-100 to-${color}-200 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform`}>
            <div className="text-4xl mb-2">{icon}</div>
            <div className={`text-3xl font-extrabold text-${color}-700`}>{summaryStats[key]}</div>
            <p className="text-gray-600 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 px-6 flex-wrap mb-6">
        {["all", "New", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilterChange(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentFilter === status
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl border border-gray-200 mx-6 overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Assigned Feedbacks</h2>
        </div>
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No feedbacks found</div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                {["ID", "CLIENT", "DESCRIPTION", "SERVICE", "STATUS", "PROGRESS", "DATE"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-gray-500 text-xs font-semibold tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((f) => (
                <tr key={f._id} className="border-b border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 font-medium text-gray-800">#{f._id}</td>
                  <td className="px-6 py-4">{f.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{f.message}</td>
                  <td className="px-6 py-4 text-gray-500">{f.service}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      feedbackStatus[f._id] === "New" ? "bg-yellow-100 text-yellow-600"
                      : feedbackStatus[f._id] === "In Progress" ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                    }`}>{feedbackStatus[f._id]}</span>
                  </td>
             <td className="px-6 py-4 w-52">
  <div className="flex items-center gap-3">
    <input
      type="range"
      min={0}
      max={100}
      value={feedbackProgress[f._id] || 0}
      onChange={(e) => setFeedbackProgress(prev => ({ ...prev, [f._id]: Number(e.target.value) }))}
      onMouseUp={(e) => handleProgressChange(f._id, Number(e.target.value))}
      onTouchEnd={(e) => handleProgressChange(f._id, Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
    />
    <span className="text-gray-500 text-xs w-10 text-right">
      {feedbackProgress[f._id] || 0}%
    </span>
  </div>
</td>


                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(f.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
