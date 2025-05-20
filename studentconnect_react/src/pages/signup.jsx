import React, { useState } from "react";
import Navbar from "../componenetes/Home/NavBarHome";
import "../styles/autenticacion/signup.css";
// Asegúrate de que el archivo esté en la misma ruta o ajústala

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

    const { nombre, correo, contraseña, acuerdo } = formData;

    if (!acuerdo) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const data = new FormData();
      data.append('nombre', nombre);
      data.append('correo', correo);
      data.append('contraseña', contraseña);
      data.append('universidad', ''); // Aquí puedes ajustar si agregas un campo de universidad

      const response = await fetch('guardar_alumno.php', {
        method: 'POST',
        body: data,
      });

      const result = await response.text();

      if (response.ok && result.includes('Registro exitoso')) {
        alert(result);
        window.location.href = 'configperfil_estudiante.html';
      } else {
        alert('Error en el registro: ' + result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
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
