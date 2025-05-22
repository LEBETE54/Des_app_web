import React, { useState } from "react";
import Navbar from "../componenetes/Home/NavBarHome";
import "../styles/autenticacion/signup.css";

const RegistroAlumno = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    acuerdo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, correo, contraseña, confirmarContraseña, acuerdo } = formData;

    if (!acuerdo) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, contraseña }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registro exitoso");
        window.location.href = "/configperfil";
      } else {
        alert(result.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
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
          <form className="registro" onSubmit={handleSubmit}>
            <h1>Crear una Cuenta</h1>
            <ul>
              <label htmlFor="nombre">Nombre Completo</label>
              <li><input type="text" id="nombre" name="nombre" required onChange={handleChange} /></li><br />

              <label htmlFor="correo">Correo Electrónico</label>
              <li><input type="email" id="correo" name="correo" required onChange={handleChange} /></li><br />

              <label htmlFor="contraseña">Contraseña</label>
              <li><input type="password" id="contraseña" name="contraseña" required onChange={handleChange} /></li><br />

              <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
              <li><input type="password" id="confirmarContraseña" name="confirmarContraseña" required onChange={handleChange} /></li><br />

              <div className="condiciones">
                <input
                  type="checkbox"
                  id="acuerdo_politicas"
                  name="acuerdo"
                  checked={formData.acuerdo}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acuerdo_politicas">
                  Al crear la cuenta, estás aceptando los términos de servicio y la política de privacidad.
                </label>
              </div><br />

              <li className="boton">
                <button type="submit">Subir Solicitud</button>
              </li>
            </ul>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegistroAlumno;