import React, { useEffect, useState } from "react";
import axios from "axios";

function OwnerPGDetails() {
  const [data, setData] = useState(null);

  const pgId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/owner/pgs/${pgId}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/payments/${id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment confirmed");
      fetchData();
    } catch (err) {
      alert("Error");
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.pg.name}</h1>

      <p className="mt-2">Members: {data.membersCount}</p>

      <h2 className="mt-4 font-bold">Payments</h2>
      {data.payments.map((p) => (
        <div key={p._id} className="mb-2">
          <p>₹{p.amount} → {p.status}</p>

          {p.proofUrl && (
            <a href={p.proofUrl} target="_blank" className="text-blue-500">
              View Proof
            </a>
          )}

          {p.status === "pending" && (
            <button
              onClick={() => handleConfirm(p._id)}
              className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
            >
              Confirm
            </button>
          )}
        </div>
      ))}

      <h2 className="mt-4 font-bold">Complaints</h2>
      {data.complaints.map((c) => (
        <p key={c._id}>
          {c.title} → {c.status}
        </p>
      ))}
    </div>
  );
}

export default OwnerPGDetails;