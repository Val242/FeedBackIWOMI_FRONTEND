import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CollaboratorDashboard() {
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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.developerId) {
      console.warn("User ID is missing");
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/collaborator/feedbacks/${currentUser.developerId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );

        const feedbackArray = data.feedbacks || [];
        const statusMap = {};
        const progressMap = {};
        let total = feedbackArray.length;
        let inProgress = 0;
        let completed = 0;
        let overdue = 0;

        feedbackArray.forEach((feedback) => {
          const id = feedback._id;
          statusMap[id] = feedback.status || "New";
          progressMap[id] = feedback.progress || 0;

          switch (feedback.status) {
            case "In Progress":
              inProgress++;
              break;
            case "Completed":
              completed++;
              break;
            case "Overdue":
              overdue++;
              break;
            default:
              break;
          }
        });

        setFeedbackList(feedbackArray);
        setFeedbackStatus(statusMap);
        setFeedbackProgress(progressMap);
        setSummaryStats({ total, inProgress, completed, overdue });

        // Notifications
        const notificationsArray = data.notifications || [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleStatusFilterChange = (status) => setCurrentFilter(status);

  const handleProgressChange = (feedbackId, newProgress) => {
    setFeedbackProgress((prev) => ({ ...prev, [feedbackId]: newProgress }));
    setFeedbackStatus((prev) => ({
      ...prev,
      [feedbackId]:
        newProgress >= 100
          ? "Completed"
          : newProgress > 0
          ? "In Progress"
          : "New",
    }));
  };

  const filteredFeedbacks = feedbackList.filter(
    (f) => currentFilter === "all" || feedbackStatus[f._id] === currentFilter
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          👩‍💻 Collaborator Dashboard
        </h1>
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="relative text-2xl hover:scale-110 transition-transform"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl mt-3 z-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm text-gray-700">{n.message}</p>
                      <span className="text-xs text-gray-400">
                        2 hours ago
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg group-hover:scale-105 transition-transform">
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
          <div
            key={key}
            className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow hover:shadow-md transition-shadow"
          >
            <div className={`text-${color}-500 text-4xl mb-3`}>{icon}</div>
            <div className={`text-3xl font-extrabold text-${color}-600`}>
              {summaryStats[key]}
            </div>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
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
                ? "bg-blue-500 text-white shadow"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl border border-gray-200 mx-6 overflow-hidden shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Feedbacks
          </h2>
        </div>
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No feedbacks found</div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "CLIENT", "DESCRIPTION", "SERVICE", "STATUS", "PROGRESS", "DATE"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-gray-500 text-xs font-semibold tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((f) => (
                <tr
                  key={f._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">#{f._id}</td>
                  <td className="px-6 py-4">{f.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{f.message}</td>
                  <td className="px-6 py-4 text-gray-500">{f.service}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        feedbackStatus[f._id] === "New"
                          ? "bg-yellow-100 text-yellow-600"
                          : feedbackStatus[f._id] === "In Progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {feedbackStatus[f._id]}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-52">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${feedbackProgress[f._id] || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-xs mt-1 block">
                      {feedbackProgress[f._id] || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{f.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
