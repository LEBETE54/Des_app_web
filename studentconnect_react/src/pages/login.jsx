import React, { useState } from "react";
import Navbar from "../componenetes/Home/NavBarHome";
import "../styles/autenticacion/signup.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasenia }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

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
            {error && <div className="error-message">{error}</div>}
            <ul>
              <label htmlFor="correo">Correo Electrónico</label>
              <li>
                <input
                  type="email"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </li>
              <br />

              <label htmlFor="contrasenia">Contraseña</label>
              <li>
                <input
                  type="password"
                  id="contrasenia"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  required
                />
              </li>
              <br />

              <li className="boton">
                <button type="submit" disabled={loading}>
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
              </li>
            </ul>
          </form>
        </div>
      </main>
    </>
  );
}