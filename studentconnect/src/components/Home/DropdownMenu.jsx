import "../../styles/Home/home.css";
import "../../styles/Home/dropdown.css";

export default function DropdownMenu() {
  return (
    <div className="dropdown_menu open">
      <li><a className="action_btn Registrarse" href="#">Registrarse</a></li>
      <li><a className="action_btn Login" href="#">Iniciar Sesión</a></li>
    </div>
  );
}
