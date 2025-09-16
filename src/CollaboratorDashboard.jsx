/*
Matricule: FE23A038
Chapter: Collaborator Dashboard
Exercise: SaaS Improved UI with Routing + Filtered Feedback Table + Progress Update + Image Modal + Smooth Entry
*/

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCollaboratorFeedbacks, updateCollaboratorFeedback } from "./api";

export default function CollaboratorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summaryStats, setSummaryStats] = useState({ total: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [feedbackProgress, setFeedbackProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const notificationsRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const token = currentUser?.token;

    if (!currentUser?.developerId || !token) {
      navigate("/login", { replace: true });
      return;
    }
    setUser(currentUser);

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await fetchCollaboratorFeedbacks(currentUser.developerId);

        const feedbackArray = res.data.feedbacks || [];
        const statusMap = {};
        const progressMap = {};
        let total = feedbackArray.length, inProgress = 0, completed = 0, overdue = 0;

        feedbackArray.forEach(f => {
          statusMap[f._id] = f.status || "New";
          progressMap[f._id] = f.progress || 0;
          switch (f.status) {
            case "In Progress": inProgress++; break;
            case "Resolved": completed++; break;
            case "Overdue": overdue++; break;
            default: break;
          }
        });

        setFeedbackList(feedbackArray);
        setFeedbackStatus(statusMap);
        setFeedbackProgress(progressMap);
        setSummaryStats({ total, inProgress, completed, overdue });

        const notificationsArray = res.data.notifications || [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter(n => !n.read).length);
      } catch (err) {
        console.error("Error fetching feedbacks:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleCardClick = statusKey => {
    const map = { total: "all", inProgress: "In Progress", completed: "Resolved", overdue: "Overdue" };
    setFilterStatus(map[statusKey] || "all");
  };

  const handleProgressChange = async (feedbackId, newProgress) => {
    setFeedbackProgress(prev => ({ ...prev, [feedbackId]: newProgress }));

    const newStatus = newProgress >= 100 ? "Resolved" : newProgress > 0 ? "In Progress" : "New";
    setFeedbackStatus(prev => ({ ...prev, [feedbackId]: newStatus }));

    try {
      await updateCollaboratorFeedback(feedbackId, { progress: newProgress, status: newStatus });
      console.log(`Feedback ${feedbackId} updated to ${newProgress}% with status ${newStatus}`);
    } catch (err) {
      console.error("Error updating feedback:", err.response?.data || err);
    }
  };

  const filteredFeedbacks = feedbackList.filter(f => filterStatus === "all" ? true : f.status === filterStatus);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
      <motion.div 
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-40 rounded-b-xl">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">👩‍💻 Hello, {user?.name}</h1>
        <div className="flex items-center gap-6">
          <div className="relative" ref={notificationsRef}>
            <button onClick={toggleNotifications} className="relative text-2xl hover:scale-110 transition-transform">
              🔔
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg mt-3 z-50 animate-slideDown">
                {notifications.length === 0 ? <div className="p-6 text-center text-gray-400">No notifications</div> :
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <p className="text-sm text-gray-700">{n.message}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {[{ key: "total", label: "Total Feedbacks", color: "blue", icon: "📊" },
          { key: "inProgress", label: "In Progress", color: "yellow", icon: "⏳" },
          { key: "completed", label: "Completed", color: "green", icon: "✅" },
          { key: "overdue", label: "Overdue", color: "red", icon: "⚠️" }].map(({ key, label, color, icon }) => (
          <motion.div key={key} onClick={() => handleCardClick(key)}
            className={`bg-gradient-to-r from-${color}-100 to-${color}-200 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl mb-2">{icon}</div>
            <div className={`text-3xl font-extrabold text-${color}-700`}>{summaryStats[key]}</div>
            <p className="text-gray-600 text-sm mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Feedback Table */}
      <motion.div className="bg-white rounded-2xl border border-gray-200 mx-6 overflow-hidden shadow-lg mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">{filterStatus === "all" ? "All Feedbacks" : `${filterStatus} Feedbacks`}</h2>
        </div>
        {filteredFeedbacks.length === 0 ? <div className="p-12 text-center text-gray-400">No feedbacks found</div> :
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>{["Client","Message","Status","Progress","Date","Image"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-gray-500 text-xs font-semibold tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map(f => (
                <tr key={f._id} className="border-b border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">{f.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{f.message}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      f.status === "In Progress" ? "bg-yellow-100 text-yellow-600" :
                      f.status === "Resolved" ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    }`}>{f.status}</span>
                  </td>
                  <td className="px-6 py-4 w-52">
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={100} value={feedbackProgress[f._id] || 0}
                        onChange={e => setFeedbackProgress(prev => ({ ...prev, [f._id]: Number(e.target.value) }))}
                        onMouseUp={e => handleProgressChange(f._id, Number(e.target.value))}
                        onTouchEnd={e => handleProgressChange(f._id, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      <span className="text-gray-500 text-xs w-10 text-right">{feedbackProgress[f._id] || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(f.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {f.image && (
                      <img src={f.image} alt="Feedback"
                        className="h-16 w-16 object-cover rounded-md cursor-pointer shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-200"
                        onClick={() => setModalImage(f.image)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </motion.div>

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Full view" className="max-h-[80%] max-w-[80%] rounded-lg shadow-lg animate-fadeIn" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </motion.div>
  );
}
