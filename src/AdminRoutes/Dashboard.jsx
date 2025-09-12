import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClipboardList, FaTasks, FaUserSlash, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    assignedFeedbacks: 0,
    unassignedFeedbacks: 0,
    totalDevelopers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "all", "assigned", "unassigned", "developers"

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const feedbackRes = await axios.get(
          "http://localhost:3000/api/admin/feedback/feedbacks",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const devRes = await axios.get(
          "http://localhost:3000/api/admin/collaboratorRoute/collaborator",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const feedbacks = feedbackRes.data;
        const devs = devRes.data;

        setStats({
          totalFeedbacks: feedbacks.length,
          assignedFeedbacks: feedbacks.filter(f => f.assignedTo).length,
          unassignedFeedbacks: feedbacks.filter(f => !f.assignedTo).length,
          totalDevelopers: devs.length,
        });

        setFilteredFeedbacks(feedbacks);
        setDevelopers(devs);
        setFilterType("all");
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const fetchFilteredFeedbacks = async (type) => {
    if (!token) return;

    if (type === "developers") {
      setFilterType("developers");
      return;
    }

    let url = "http://localhost:3000/api/admin/feedback/feedbacks";
    if (type === "assigned") url += "?assignedTo=assigned";
    else if (type === "unassigned") url += "?assignedTo=null";

    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setFilteredFeedbacks(res.data);
      setFilterType(type);
    } catch (err) {
      console.error("Error fetching filtered feedbacks:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-gray-500 text-lg">Loading dashboard stats...</p>
      </div>
    );

  const statItems = [
    {
      label: "Total Feedbacks",
      value: stats.totalFeedbacks,
      icon: <FaClipboardList className="text-3xl text-blue-500" />,
      filter: "all",
    },
    {
      label: "Assigned Feedbacks",
      value: stats.assignedFeedbacks,
      icon: <FaTasks className="text-3xl text-yellow-500" />,
      filter: "assigned",
    },
    {
      label: "Unassigned Feedbacks",
      value: stats.unassignedFeedbacks,
      icon: <FaUserSlash className="text-3xl text-red-500" />,
      filter: "unassigned",
    },
    {
      label: "Total Developers",
      value: stats.totalDevelopers,
      icon: <FaUsers className="text-3xl text-green-500" />,
      filter: "developers",
    },
  ];

  const getFilterTitle = () => {
    switch (filterType) {
      case "assigned":
        return "Assigned Feedbacks";
      case "unassigned":
        return "Unassigned Feedbacks";
      case "developers":
        return "All Developers";
      default:
        return "All Feedbacks";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, idx) => (
          <motion.div
            key={idx}
            onClick={() => stat.filter && fetchFilteredFeedbacks(stat.filter)}
            className={`p-6 rounded-2xl shadow-lg transition transform hover:-translate-y-1 ${
              stat.filter ? "cursor-pointer" : ""
            } ${filterType === stat.filter ? "bg-white border-2 border-indigo-400" : "bg-white/80 backdrop-blur-md"}`}
            whileHover={{ scale: stat.filter ? 1.04 : 1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              {stat.icon}
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filtered Content Table */}
      <motion.div
        key={filterType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{getFilterTitle()}</h2>

        {filterType === "developers" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Name", "Email", "Role"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-gray-600 font-medium text-sm border-b border-gray-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {developers.map((dev) => (
                  <tr key={dev._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-800 font-medium">#{dev._id}</td>
                    <td className="px-4 py-2">{dev.name}</td>
                    <td className="px-4 py-2">{dev.email}</td>
                    <td className="px-4 py-2">{dev.role || "Developer"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <p className="text-gray-500">No feedbacks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Client", "Message", "Status", "Assigned To", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-gray-600 font-medium text-sm border-b border-gray-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-800 font-medium">#{f._id}</td>
                    <td className="px-4 py-2">{f.name}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{f.message}</td>
                    <td className="px-4 py-2">{f.status || "New"}</td>
                    <td className="px-4 py-2">{f.assignedTo?.name || "Unassigned"}</td>
                    <td className="px-4 py-2">{new Date(f.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
