import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function OwnerDashboard() {
  const [requests, setRequests] = useState([]);
  const [myPGs, setMyPGs] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState("");
  const [inviteCode, setInviteCode] = useState("");

useEffect(() => {
  fetchRequests();
  fetchMyPGs();
}, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/owner/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyPGs = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/owner/pgs",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMyPGs(res.data.pgs);
  } catch (err) {
    console.log(err);
  }
};

  const handleCreatePG = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/owner/pgs",
      { name, address, city, capacity, inviteCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("PG created");
    fetchMyPGs();
  } catch (err) {
    alert("Error creating PG");
  }
};


const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/owner/pgs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Deleted");
    fetchMyPGs();
  } catch (err) {
    alert("Error deleting");
  }
};



  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/owner/requests/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Approved");
      fetchRequests();
    } catch (err) {
      alert("Error approving");
    }
  };

  return (
    <>
     <Navbar />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>

      <div className="mb-6">
  <h2 className="text-xl font-bold mb-2">Create New PG</h2>

  <input
    type="text"
    placeholder="PG Name"
    className="border p-2 mr-2"
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="text"
    placeholder="Address"
    className="border p-2 mr-2"
    onChange={(e) => setAddress(e.target.value)}
  />

  <input
    type="text"
    placeholder="City"
    className="border p-2 mr-2"
    onChange={(e) => setCity(e.target.value)}
  />

  <input
    type="number"
    placeholder="Capacity"
    className="border p-2 mr-2"
    onChange={(e) => setCapacity(e.target.value)}
  />

  <input
    type="text"
    placeholder="Invite Code"
    className="border p-2 mr-2"
    onChange={(e) => setInviteCode(e.target.value)}
  />

  <button
    onClick={handleCreatePG}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Create PG
  </button>
</div>



<h2 className="text-xl font-bold mb-2">My PGs</h2>

{myPGs.map((pg) => (
    <div
    key={pg._id}
    onClick={() => (window.location.href = `/owner/pg/${pg._id}`)}
    className="border p-3 mb-2 rounded cursor-pointer">
    <p><b>Name:</b> {pg.name}</p>
    <p><b>City:</b> {pg.city}</p>
    <p><b>Approved:</b> {pg.isApprovedByAdmin ? "Yes" : "No"}</p>

    <button onClick={() => handleDelete(pg._id)} className="bg-red-500 text-white px-2 py-1 mt-2 rounded">         
        Delete 
    </button>

  </div>
))}




      {requests.map((req) => (
        <div key={req._id} className="border p-4 mb-3 rounded">
          <p><b>Student:</b> {req.studentId.name}</p>
          <p><b>Email:</b> {req.studentId.email}</p>
          <p><b>PG:</b> {req.pgId.name}</p>

          <button
            onClick={() => handleApprove(req._id)}
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            Approve
          </button>
        </div>
      ))}



    </div>
     </>
  );
}

export default OwnerDashboard;