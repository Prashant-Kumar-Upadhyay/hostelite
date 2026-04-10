import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [pgs, setPgs] = useState([]);

  useEffect(() => {
    fetchPendingPGs();
  }, []);

  const fetchPendingPGs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        " https://hostelite-backend.onrender.com/api/admin/pgs/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPgs(res.data.pgs);
      console.log("PGs:", res.data.pgs);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        ` https://hostelite-backend.onrender.com/api/admin/pgs/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Approved");
      fetchPendingPGs();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {pgs.length === 0 && (
        <p className="text-gray-500">No pending PGs</p>
      )}

      {pgs.map((pg) => (
        <div key={pg._id} className="border p-4 mb-3 rounded">
          <h2 className="font-bold">{pg.name}</h2>
          <p>{pg.address}</p>
          <p>{pg.city}</p>

          <button
            onClick={() => handleApprove(pg._id)}
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;