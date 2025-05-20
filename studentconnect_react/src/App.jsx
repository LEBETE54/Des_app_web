// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BuscarAsesoria from "./pages/BuscarAsesoria";
import Recursos from "./pages/Recursos";
// import Signup from "./pages/Signup"; // si ya la tienes
// import Login from "./pages/Login"; // si ya la tienes

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/BuscarAsesoria" element={<BuscarAsesoria />} />
        <Route path="/Recursos" element={<Recursos />} />
        {/* <Route path="/signupalumnos" element={<Signup />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
