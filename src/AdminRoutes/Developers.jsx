import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDev, setNewDev] = useState({ name: "", email: "", password: "", role: "" });

  const token = JSON.parse(localStorage.getItem("currentUser"))?.token;

  useEffect(() => {
    const fetchDevelopers = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          "http://localhost:3000/api/admin/collaboratorRoute/collaborator",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDevelopers(res.data);
      } catch (err) {
        console.error("Error fetching developers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, [token]);

  const handleCreateDeveloper = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/registerdeveloper",
        newDev,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevelopers(prev => [...prev, res.data]);
      setNewDev({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Error creating developer:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <p className="text-gray-500 text-lg">Loading developers...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 space-y-8">
    

      {/* Developers Table */}
      <motion.div
        className="overflow-x-auto bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Developer List</h2>
        <table className="min-w-full border border-gray-200 rounded-xl">
          <thead className="bg-gray-50 rounded-t-xl">
            <tr>
              {["Name", "Email", "Role"].map(head => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {developers.map((dev, idx) => (
              <tr
                key={dev._id || idx}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition`}
              >
                <td className="px-6 py-4 text-sm">{dev.name}</td>
                <td className="px-6 py-4 text-sm">{dev.email}</td>
                <td className="px-6 py-4 text-sm">{dev.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

        {/* Form Card */}
      <motion.div
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Add New Developer</h2>
        <form onSubmit={handleCreateDeveloper} className="space-y-4">
          {["name", "email", "password", "role"].map(field => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newDev[field]}
              onChange={e => setNewDev({ ...newDev, [field]: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
              required
            />
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Create Developer
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Developers;
