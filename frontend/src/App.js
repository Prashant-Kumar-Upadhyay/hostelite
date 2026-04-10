import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PGDetails from "./pages/PGDetails";
import OwnerDashboard from "./pages/OwnerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentPGDetails from "./pages/StudentPGDetails";
import OwnerPGDetails from "./pages/OwnerPGDetails";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pg/:id" element={<PGDetails />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/pg/:id" element={<StudentPGDetails />} />
        <Route path="/owner/pg/:id" element={<OwnerPGDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;