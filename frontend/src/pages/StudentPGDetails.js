import React, { useEffect, useState } from "react";
import axios from "axios";


function StudentPGDetails() {
  const [data, setData] = useState(null);

  const [file, setFile] = useState(null);

  const pgId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/pgs/${pgId}/dashboard`,
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


  const handleAddPayment = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("pgId", pgId);
    formData.append("amount", 5000);
    formData.append("monthFor", "March");
    formData.append("proof", file);

    await axios.post(
      "http://localhost:5000/api/payments",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Payment submitted with proof");
    fetchData();
  } catch (err) {
    alert("Payment error");
  }
};


  const handleAddComplaint = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/complaints",
      {
        pgId,
        title: "Sample issue",
        description: "Fan not working",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Complaint added");
    fetchData();
  } catch (err) {
    alert("Error adding complaint");
  }
};



  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.pg.name}</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2"/>

      <button onClick={handleAddPayment}
      className="bg-green-500 text-white px-3 py-1 rounded mb-2">
         Pay Rent
      </button>

      <h2 className="mt-4 font-bold">Payments</h2>
   
      {data.payments.map((p) => (
        <div key={p._id}>
        <p>₹{p.amount} → {p.status}</p>

        {p.proofUrl && (
        <a href={p.proofUrl} target="_blank" className="text-blue-500">
        View Proof
      </a>
    )}
  </div>
))}

    <button
    onClick={handleAddComplaint}
    className="bg-red-500 text-white px-3 py-1 rounded mb-2">
       Add Complaint
    </button>


      <h2 className="mt-4 font-bold">Complaints</h2>
      {data.complaints.map((c) => (
        <p key={c._id}>
          {c.title} → {c.status}
        </p>
      ))}
    </div>
  );
}

export default StudentPGDetails;