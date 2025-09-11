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
        const developers = devRes.data;

        setStats({
          totalFeedbacks: feedbacks.length,
          assignedFeedbacks: feedbacks.filter(f => f.assignedTo).length,
          unassignedFeedbacks: feedbacks.filter(f => !f.assignedTo).length,
          totalDevelopers: developers.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-gray-500 text-lg">Loading dashboard stats...</p>
      </div>
    );

  const statItems = [
    { label: "Total Feedbacks", value: stats.totalFeedbacks, icon: <FaClipboardList className="text-3xl text-blue-500" /> },
    { label: "Assigned Feedbacks", value: stats.assignedFeedbacks, icon: <FaTasks className="text-3xl text-yellow-500" /> },
    { label: "Unassigned Feedbacks", value: stats.unassignedFeedbacks, icon: <FaUserSlash className="text-3xl text-red-500" /> },
    { label: "Total Developers", value: stats.totalDevelopers, icon: <FaUsers className="text-3xl text-green-500" /> },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            whileHover={{ scale: 1.04 }}
          >
            <div className="flex items-center gap-4 mb-4">
              {stat.icon}
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Welcome Section */}
      <motion.div
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Your Admin Dashboard</h2>
        <p className="text-gray-600 mb-2">
          Monitor feedback activity and manage your developers efficiently. Use the statistics above to quickly track total feedbacks, assigned tasks, and your team size.
        </p>
        <p className="text-gray-600 mb-2">
          Keep an eye on unassigned feedbacks to ensure nothing is missed. Assign tasks to developers promptly to maintain smooth workflow.
        </p>
        <p className="text-gray-600">
          Explore the navigation tabs to view detailed feedback lists, developer profiles, and other management tools.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
