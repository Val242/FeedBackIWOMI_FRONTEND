/*
  Matricule: FE23A038
  Component: CollaboratorFeedbackStatusRoutes
  Purpose: Display collaborator feedbacks filtered by status
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function CollaboratorFeedbackStatusRoutes({ developerId, status = "all" }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  useEffect(() => {
    if (!developerId || !token) {
      console.log("Missing developerId or token");
      return;
    }

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        // Encode the status to handle spaces
        const query = status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
        const url = `http://localhost:3000/api/collaborator/feedbacks/${developerId}${query}`;
        console.log("Fetching feedbacks from URL:", url);

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Received feedbacks data:", res.data.feedbacks);
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [developerId, status, token]);

  if (loading) return <p className="text-gray-500">Loading feedbacks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        {status === "all"
          ? "All Feedbacks"
          : `${status.charAt(0).toUpperCase() + status.slice(1)} Feedbacks`}
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Client", "Message", "Status", "Image"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedbacks.map((fb, idx) => (
              <motion.tr
                key={fb._id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{fb.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{fb.message}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      fb.status === "Resolved"
                        ? "bg-green-100 text-green-600"
                        : fb.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {fb.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {fb.image ? (
                    <img
                      src={fb.image}
                      alt="feedback"
                      className="h-12 w-12 object-cover rounded cursor-pointer border"
                      onClick={() => setSelectedImage(fb.image)}
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
