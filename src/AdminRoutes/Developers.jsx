import React, { useState, useEffect } from "react";
import axios from "axios";

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

  if (loading) return <p>Loading developers...</p>;

  return (
    <div>
      <form onSubmit={handleCreateDeveloper} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={newDev.name}
          onChange={e => setNewDev({ ...newDev, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newDev.email}
          onChange={e => setNewDev({ ...newDev, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newDev.password}
          onChange={e => setNewDev({ ...newDev, password: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={newDev.role}
          onChange={e => setNewDev({ ...newDev, role: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Create Developer
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Role"].map(head => (
              <th key={head} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {developers.map((dev, idx) => (
            <tr key={dev._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 text-sm">{dev.name}</td>
              <td className="px-6 py-4 text-sm">{dev.email}</td>
              <td className="px-6 py-4 text-sm">{dev.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Developers;
