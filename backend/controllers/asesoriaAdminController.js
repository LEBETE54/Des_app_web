// ✅ CONTROLADOR (controllers/asesoriaAdminController.js)
const AsesoriaAdminModel = require('../models/AsesoriaAdminModel');

exports.obtenerAsesoriaPorId = (req, res) => {
  const id = req.params.id;
  AsesoriaAdminModel.obtenerPorId(id, (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener asesoría.' });
    if (result.length === 0) return res.status(404).json({ mensaje: 'Asesoría no encontrada.' });

    const asesoria = result[0];

    AsesoriaAdminModel.obtenerAlumnos(id, (errAlum, alumnos) => {
      if (errAlum) return res.status(500).json({ mensaje: 'Error al obtener alumnos.' });
      res.json({ asesoria, alumnos });
    });
  });
};

// ✅ Obtener alumnos inscritos en una asesoría (para ruta específica)
exports.obtenerAlumnosDeAsesoria = (req, res) => {
  const id = req.params.id;

  AsesoriaAdminModel.obtenerAlumnos(id, (err, alumnos) => {
    if (err) {
      console.error("Error al obtener alumnos:", err);
      return res.status(500).json({ mensaje: "Error al obtener alumnos." });
    }
    res.json(alumnos);
  });
};

exports.obtenerUltimaAsesoriaDeTutor = (req, res) => {
  const tutorId = req.params.id;

  AsesoriaAdminModel.obtenerUltimaAsesoriaDeTutor(tutorId, (err, result) => {
    if (err) {
      console.error("Error al obtener la última asesoría:", err);
      return res.status(500).json({ mensaje: 'Error al obtener la última asesoría.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron asesorías para este tutor.' });
    }

    const asesoria = result[0];

    AsesoriaAdminModel.obtenerAlumnos(asesoria.id, (errAlumnos, alumnos) => {
      if (errAlumnos) {
        console.error("Error al obtener alumnos:", errAlumnos);
        return res.status(500).json({ mensaje: 'Error al obtener alumnos.' });
      }

      res.json({ asesoria, alumnos });
    });
  });
};



exports.actualizarAsesoria = (req, res) => {
  const id = req.params.id;
  AsesoriaAdminModel.actualizar(id, req.body, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar asesoría.' });
    res.json({ mensaje: 'Asesoría actualizada correctamente.' });
  });
};

exports.eliminarAsesoria = (req, res) => {
  const id = req.params.id;
  AsesoriaAdminModel.eliminar(id, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar asesoría.' });
    res.json({ mensaje: 'Asesoría eliminada.' });
  });
};

exports.eliminarAlumnoDeAsesoria = (req, res) => {
  const { id, alumnoId } = req.params;

  AsesoriaAdminModel.eliminarAlumno(id, alumnoId, (err) => {
    if (err) {
      console.error('Error al eliminar alumno:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar alumno.' });
    }

    res.json({ mensaje: 'Alumno eliminado de la asesoría.' });
  });
};
