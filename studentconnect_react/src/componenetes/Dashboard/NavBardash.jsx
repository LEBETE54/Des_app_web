import logo from "../../assets/LogoV2.svg";
import { useState } from "react";
import "../../styles/Home/NavBarHome.css";

export default function Navbardash() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="toggle_btn" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </header>
  );
}