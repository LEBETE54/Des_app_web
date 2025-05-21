import Navbar from "../componenetes/Home/NavBarHome";
import "../styles/autenticacion/signup.css";

export default function Login() {
  return (
    <>
      <Navbar />

      <main>
        <div className="btn_volver">
          <a className="enlace_home" href="/">
            <div className="icon_flecha">
              <i className="fa-solid fa-circle-arrow-left"></i>
            </div>
            <div className="volver">Volver</div>
          </a>
        </div>

        <div className="formulario">
          <form className="registro" onSubmit={handleLogin}>
            <h1>Iniciar Sesión</h1>
            <ul>
              <label htmlFor="correo">Correo Electrónico</label>
              <li><input type="email" id="correo" required /></li><br />

              <label htmlFor="contraseña">Contraseña</label>
              <li><input type="password" id="contraseña" required /></li><br />

              <li className="boton">
                <button type="submit">Iniciar Sesión</button>
              </li>
            </ul>
          </form>
        </div>
      </main>
    </>
  );
}

// Simulación de inicio de sesión (puedes conectar con backend si deseas)
function handleLogin(event) {
  event.preventDefault();
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;

  // Aquí iría tu lógica real de login
  if (correo === "test@correo.com" && contraseña === "1234") {
    alert("Inicio de sesión exitoso");
    window.location.href = "/perfil"; // o usar navigate() con React Router
  } else {
    alert("Correo o contraseña incorrectos");
  }
}
