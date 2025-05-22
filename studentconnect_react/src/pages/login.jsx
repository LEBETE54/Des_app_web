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

async function handleLogin(event) {
  event.preventDefault();
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
      window.location.href = "/home";
    } else {
      alert(data.message || "Correo o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo conectar con el servidor");
  }
}