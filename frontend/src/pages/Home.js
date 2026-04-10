import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function Home() {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [popular, setPopular] = useState([]);
  const [keyword, setKeyword] = useState(""); // ✅ added

  useEffect(() => {

      const token = localStorage.getItem("token");

      if (!token) {
      navigate("/login");
       return;
       }


    fetchPGs();
    fetchPopular();
  }, []);

  const fetchPGs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/pgs/recommended?city=Bengaluru"
      );
      setPgs(res.data.recommended);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPopular = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/pgs/popular"
      );
      setPopular(res.data.popular);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SEARCH FUNCTION
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pgs/search?city=Bengaluru&keyword=${keyword}`
      );
      setPgs(res.data.pgs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">

        {/* 🔍 SEARCH BOX */}
        <input
          type="text"
          placeholder="Search PG by name or area..."
          className="w-full p-3 border rounded mb-4"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          Search
        </button>

        {/* Recommended */}
        <h2 className="text-2xl font-bold mb-4">Recommended PGs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pgs.map((pg) => (
            <div key={pg._id} onClick={() => navigate(`/pg/${pg._id}`)} className="border p-4 rounded shadow cursor-pointer">
              <h3 className="text-lg font-bold">{pg.name}</h3>
              <p>{pg.address}</p>
              <p className="text-gray-500">{pg.city}</p>
            </div>
          ))}
        </div>

        {/* Popular */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Popular PGs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popular.map((pg) => (
            <div key={pg._id} onClick={() => navigate(`/pg/${pg._id}`)} className="border p-4 rounded shadow cursor-pointer">
              <h3 className="text-lg font-bold">{pg.name}</h3>
              <p>{pg.address}</p>
              <p className="text-gray-500">{pg.city}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;