import apiClient from './apiClient';

const obtenerPerfilUsuario = async (userId) => {
  const response = await apiClient.get(`/usuarios/${userId}`);
  return response.data;
};

const actualizarPerfilUsuario = async (userId, datosActualizados) => {
  const response = await apiClient.put(`/usuarios/${userId}`, datosActualizados);
  return response.data;
};


export default { 
    obtenerPerfilUsuario,
    actualizarPerfilUsuario 
};

