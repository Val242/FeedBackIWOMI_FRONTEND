import React, { useState, useEffect, useRef } from "react";

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
  setUser(currentUser);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/feedbacks/assigned", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      const statusMap = {};
      const progressMap = {};
      let total = data.length;
      let inProgress = 0;
      let completed = 0;
      let overdue = 0;

      data.forEach((feedback) => {
        statusMap[feedback.id] = feedback.status;
        progressMap[feedback.id] = feedback.progress || 0;

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
        }
      });

      setFeedbackList(data);
      setFeedbackStatus(statusMap);
      setFeedbackProgress(progressMap);
      setSummaryStats({ total, inProgress, completed, overdue });
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
    (f) => currentFilter === "all" || feedbackStatus[f.id] === currentFilter
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Collaborateur
        </h1>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="text-2xl relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md mt-2 z-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 border-b border-gray-100 text-sm"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-gray-700 text-sm">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {["total", "inProgress", "completed", "overdue"].map((key) => (
          <div
            key={key}
            className="bg-white p-6 rounded-xl border border-gray-200 text-center"
          >
            <div
              className={`text-3xl font-bold mb-2 ${
                key === "total"
                  ? "text-blue-500"
                  : key === "inProgress"
                  ? "text-yellow-500"
                  : key === "completed"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {summaryStats[key]}
            </div>
            <div className="text-gray-500 text-sm">
              {key === "total"
                ? "Total Feedbacks"
                : key === "inProgress"
                ? "En cours"
                : key === "completed"
                ? "Terminés"
                : "En retard"}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 px-6 flex-wrap mb-4">
        {["all", "New", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilterChange(status)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
              currentFilter === status
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {status === "all" ? "Tous" : status}
          </button>
        ))}
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl border border-gray-200 mx-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Feedbacks Assignés</h2>
        </div>
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun feedback trouvé</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["ID", "CLIENT", "DESCRIPTION", "SERVICE", "STATUT", "PROGRESSION", "DATE"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-gray-500 text-xs font-semibold"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((f) => (
                <tr key={f.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-800 font-medium">#{f.id}</td>
                  <td className="px-6 py-4">{f.submitter?.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{f.message}</td>
                  <td className="px-6 py-4 text-gray-500">{f.service}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        feedbackStatus[f.id] === "New"
                          ? "bg-yellow-100 text-yellow-600"
                          : feedbackStatus[f.id] === "In Progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {feedbackStatus[f.id]}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-52">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={feedbackProgress[f.id] || 0}
                        onChange={(e) =>
                          handleProgressChange(f.id, parseInt(e.target.value))
                        }
                        className="flex-1 h-2 rounded-lg accent-blue-500"
                      />
                      <span className="text-gray-500 text-xs w-10">
                        {feedbackProgress[f.id] || 0}%
                      </span>
                    </div>
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
