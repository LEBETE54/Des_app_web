// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recursos from "./pages/Recursos";
import ConfigPerfilPage from "./pages/ConfigPerfilPage";
import Signup from "./pages/signup"; // si ya la tienes
import Login from "./pages/login"; // si ya la tienes
import Dashboard from "./pages/Dashboard";
import MisAsesorias from "./pages/MisAsesorias";
import BuscarAsesorias from "./pages/BuscarAsesorias";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configperfil" element={<ConfigPerfilPage />} />
        <Route path="/dashboard/Recursos" element={<Recursos />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard/mis-asesorias" element={<MisAsesorias />} />
        <Route path="/dashboard/buscar-asesorias" element={<BuscarAsesorias />} />
      </Routes>
    </Router>
  );
}
