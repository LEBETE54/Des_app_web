import "../buscasesoria_style.css";
import Logo from "../assets/imagenes/LogoV2.svg";

export default function Navbar() {
  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <ul className="links">
          <li>
            <a href="misproyectos.html">Mis Asesorías</a>
          </li>
          <li>
            <a href="perfil_alumnos.html">
              <i className="fa-regular fa-circle-user" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
