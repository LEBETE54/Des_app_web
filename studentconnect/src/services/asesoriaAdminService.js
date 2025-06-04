// services/asesoriaAdminService.js
import apiClient from './apiClient';

// Obtener asesoría por ID
export const obtenerAsesoriaPorId = async (id) => {
  const response = await apiClient.get(`/asesoria-admin/${id}`);
  return response.data;
};

// Actualizar asesoría
export const actualizarAsesoria = async (id, data) => {
  const response = await apiClient.put(`/asesoria-admin/${id}`, data);
  return response.data;
};

// Eliminar asesoría
export const eliminarAsesoria = async (id) => {
  const response = await apiClient.delete(`/asesoria-admin/${id}`);
  return response.data;
};

// Obtener alumnos inscritos a una asesoría
export const obtenerAlumnosInscritos = async (id) => {
  const response = await apiClient.get(`/asesoria-admin/${id}/alumnos`);
  return response.data;
};

// Eliminar un alumno de la asesoría
export const eliminarAlumnoDeAsesoria = async (asesoriaId, alumnoId) => {
  const response = await apiClient.delete(`/asesoria-admin/${asesoriaId}/alumnos/${alumnoId}`);
  return response.data;
};

export const obtenerUltimaAsesoriaDelTutor = async (tutorId) => {
  const response = await apiClient.get(`/asesoria-admin/tutor/${tutorId}/ultima`);
  return response.data;
};



export default {
  obtenerAsesoriaPorId,
  actualizarAsesoria,
  eliminarAsesoria,
  obtenerAlumnosInscritos,
  eliminarAlumnoDeAsesoria,
  obtenerUltimaAsesoriaDelTutor
};
