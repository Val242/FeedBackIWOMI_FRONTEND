import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "assigned", "unassigned"

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  const fetchData = async () => {
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

      setFeedbacks(feedbackRes.data);
      setDevelopers(devRes.data);
      setDisplayedFeedbacks(feedbackRes.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Update displayedFeedbacks based on filter
  useEffect(() => {
    if (filter === "all") setDisplayedFeedbacks(feedbacks);
    else if (filter === "assigned")
      setDisplayedFeedbacks(feedbacks.filter(fb => fb.assignedTo));
    else if (filter === "unassigned")
      setDisplayedFeedbacks(feedbacks.filter(fb => !fb.assignedTo));
  }, [filter, feedbacks]);

  const handleAssignFeedback = async (feedbackId, devId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/assign/feedbacks/assign/${feedbackId}`,
        { assignedTo: devId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(prev =>
        prev.map(f => (f._id === feedbackId ? { ...f, assignedTo: devId } : f))
      );
    } catch (err) {
      console.error("Error assigning feedback:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading feedbacks...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-4 justify-center mb-4">
        {["all", "assigned", "unassigned"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/80 backdrop-blur-md hover:bg-indigo-100"
            }`}
          >
            {f === "all"
              ? "All Feedbacks"
              : f === "assigned"
              ? "Assigned Feedbacks"
              : "Unassigned Feedbacks"}
          </button>
        ))}
      </div>

      {/* Feedback Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {filter === "all"
              ? "All Feedbacks"
              : filter === "assigned"
              ? "Assigned Feedbacks"
              : "Unassigned Feedbacks"}
          </h2>

          {displayedFeedbacks.length === 0 ? (
            <p className="text-gray-500 text-center">No feedbacks found.</p>
          ) : (
            <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Message",
                    "Time",
                    "Criticality",
                    "Status",
                    "Assigned To",
                    "Image",
                  ].map(head => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedFeedbacks.map((fb, idx) => {
                  const assignedDev = developers.find(d => d._id === fb.assignedTo);
                  return (
                    <tr
                      key={fb._id || idx}
                      className={`transition-colors duration-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 text-sm">{fb.name}</td>
                      <td className="px-6 py-4 text-sm">{fb.email}</td>
                      <td className="px-6 py-4 text-sm max-w-[200px] truncate">{fb.message}</td>
                      <td className="px-6 py-4 text-sm">{fb.timestamp}</td>
                      <td className="px-6 py-4 text-sm">{fb.criticality}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
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
                          onChange={e => handleAssignFeedback(fb._id, e.target.value)}
                          className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        >
                          <option value="">Unassigned</option>
                          {developers.map(dev => (
                            <option key={dev._id} value={dev._id}>
                              {dev.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {fb.image && (
                          <img
                            src={fb.image}
                            alt="Feedback"
                            className="h-16 w-16 object-cover rounded-md cursor-pointer shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-200"
                            onClick={() => setModalImage(fb.image)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Image Modal */}
      {modalImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <motion.img
            src={modalImage}
            alt="Full view"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-h-[80%] max-w-[80%] rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Feedback;
