import React, { useState, useEffect } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

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
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

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
        <p className="text-gray-600 text-lg">Loading feedbacks...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Feedback Dashboard
        </h2>
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-gray-100">
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
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb, idx) => {
              const assignedDev = developers.find(d => d._id === fb.assignedTo);
              return (
                <tr
                  key={fb._id || idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
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
                      onChange={e => handleAssignFeedback(fb._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none transition"
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
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full view"
            className="max-h-[80%] max-w-[80%] rounded-lg shadow-2xl animate-fadeIn"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Feedback;
