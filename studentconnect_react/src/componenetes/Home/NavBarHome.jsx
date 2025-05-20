import logo from "../../assets/LogoV2.svg";
import { useState } from "react";
import "../../styles/Home/NavBarHome.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <ul className="links">
          <li><a href="#">Estudiantes</a></li>
          <a className="action_btn Registrarse" href="/signupalumnos">Registrarse</a>
          <a className="action_btn Login" href="#">Iniciar Sesión</a>
        </ul>
        <div className="toggle_btn" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </header>
  );
}
