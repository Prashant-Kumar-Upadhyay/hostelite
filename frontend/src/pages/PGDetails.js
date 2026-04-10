import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PGDetails() {
  const { id } = useParams();
  const [pg, setPg] = useState(null);

  useEffect(() => {
    fetchPG();
  }, []);

  const fetchPG = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/pgs/search?city=Bengaluru"
      );

      const found = res.data.pgs.find((p) => p._id === id);
      setPg(found);
    } catch (err) {
      console.log(err);
    }
  };


  const handleApply = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:5000/api/pgs/${id}/apply`,
      { message: "I want to join this PG" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Applied successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Apply failed");
  }
};



  if (!pg) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{pg.name}</h1>
      <p>{pg.address}</p>
      <p>{pg.city}</p>

      <button onClick={handleApply} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Apply
      </button>
    </div>
  );
}

export default PGDetails;