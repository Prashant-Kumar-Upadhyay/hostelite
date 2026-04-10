import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = async () => {
    console.log("button clicked");
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    console.log(res.data);

    localStorage.setItem("token", res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login successful");
    if (res.data.user.role === "admin") {
     window.location.href = "/admin";
    } else if (res.data.user.role === "owner") {
     window.location.href = "/owner";
    } else {
     window.location.href = "/";
    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
           Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => (window.location.href = "/register")}>
          Register
         </span>
        </p>
          
      </div>
    </div>
  );
}

export default Login;