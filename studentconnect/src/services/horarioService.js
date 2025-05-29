import apiClient from './apiClient'; 

const API_ENDPOINT_HORARIOS = '/horarios'; // Esto está bien

const crearHorario = async (horarioData) => {
    try {
        const response = await apiClient.post(API_ENDPOINT_HORARIOS, horarioData);
        return response.data;
    } catch (error) {
        console.error('Error en servicio crearHorario:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al crear el horario disponible');
    }
};

const obtenerMisHorarios = async () => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT_HORARIOS}/mis-horarios`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerMisHorarios:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener mis horarios');
    }
};

const obtenerHorarioPorId = async (id) => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT_HORARIOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerHorarioPorId:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener el detalle del horario');
    }
};

const actualizarHorario = async (id, horarioData) => {
    try {
        const response = await apiClient.put(`${API_ENDPOINT_HORARIOS}/${id}`, horarioData);
        return response.data;
    } catch (error) {
        console.error('Error en servicio actualizarHorario:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al actualizar el horario');
    }
};

const eliminarHorario = async (id) => {
    try {
        const response = await apiClient.delete(`${API_ENDPOINT_HORARIOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio eliminarHorario:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al eliminar el horario');
    }
};

const obtenerHorariosDisponiblesParaEstudiantes = async (filtros = {}) => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT_HORARIOS}/disponibles-para-reserva`, { params: filtros });
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerHorariosDisponiblesParaEstudiantes:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al buscar horarios disponibles');
    }
};

const horarioService = {
    crearHorario,
    obtenerMisHorarios,
    obtenerHorarioPorId,
    actualizarHorario,
    eliminarHorario,
    obtenerHorariosDisponiblesParaEstudiantes
};

export default horarioService;
