import React, { useState } from "react";

function Navbar() {

    const [showMenu, setShowMenu] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out");
        window.location.href = "/login";
    };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-500 text-white relative">
      <h1 className="text-xl font-bold">Hostelite</h1>

      <div className="space-x-4">
        <button onClick={() => setShowMenu(!showMenu)} 
         className="bg-white text-blue-500 px-3 py-1 rounded">
          Profile
        </button>
        
        {showMenu && user && (
  <div className="absolute right-6 mt-2 bg-white text-black shadow p-3 rounded w-48">
    <p><b>Name:</b> {user.name}</p>
    <p><b>Email:</b> {user.email}</p>
    <p><b>Role:</b> {user.role}</p>
  </div>
)}


        {user?.role === "student" && (
  <button
    onClick={() => (window.location.href = "/student")}
    className="bg-white text-blue-500 px-3 py-1 rounded mr-2"
  >
    My PG
  </button>
)}



        <button onClick={handleLogout} className="bg-white text-blue-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;