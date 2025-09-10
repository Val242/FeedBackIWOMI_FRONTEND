import React, { useState, useEffect } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Message", "Time", "Criticality", "Status", "Assigned To", "Image"].map(
              head => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, idx) => {
            const assignedDev = developers.find(d => d._id === fb.assignedTo);
            return (
              <tr key={fb._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
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
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {developers.map(dev => (
                      <option key={dev._id} value={dev._id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">{fb.image}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
