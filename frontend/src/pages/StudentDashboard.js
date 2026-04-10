import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [myPGs, setMyPGs] = useState([]);

  useEffect(() => {
    fetchMyPGs();
  }, []);

  const fetchMyPGs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/pgs/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyPGs(res.data.myPGs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My PG</h1>

      {myPGs.length === 0 && (
        <p className="text-gray-500">You have not joined any PG</p>
      )}

      {myPGs.map((item) => (
        <div key={item.pg._id} onClick={() => (window.location.href = `/student/pg/${item.pg._id}`)}   
        className="border p-4 rounded mb-3 cursor-pointer">
          <h2 className="text-lg font-bold">{item.pg.name}</h2>
          <p>{item.pg.address}</p>
          <p className="text-gray-500">{item.pg.city}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;