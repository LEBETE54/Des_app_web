import apiClient from './apiClient';

const reservarAsesoria = async (horarioId, estudianteId) => {
  const response = await apiClient.post('/reservas', {
    horario_disponibilidad_id: horarioId,
    estudiante_usuario_id: estudianteId
  });
  return response.data;
};

const obtenerReservasPorEstudiante = async (id) => {
  const response = await apiClient.get(`/reservas/por-estudiante/${id}`);
  return response.data;
};

export default {
  reservarAsesoria,
  obtenerReservasPorEstudiante
};