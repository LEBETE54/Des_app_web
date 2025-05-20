import "../styles/home.css";
import "../styles/dropdown.css";

export default function DropdownMenu() {
  return (
    <div className="dropdown_menu open">
      <li><a href="#">Estudiante</a></li>
      <li><a href="#">Empresa</a></li>
      <li><a className="action_btn Registrarse" href="/signupalumnos">Registrarse</a></li>
      <li><a className="action_btn Login" href="#">Iniciar Sesión</a></li>
    </div>
  );
}
