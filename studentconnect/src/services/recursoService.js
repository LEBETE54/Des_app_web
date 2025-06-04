// Ruta: frontend/src/services/recursoService.js

// 1. IMPORTA apiClient UNA SOLA VEZ
import apiClient from './apiClient'; // Asegúrate que apiClient.js esté en la misma carpeta 'services'

const API_ENDPOINT_RECURSOS = '/recursos'; // Endpoint del backend para la API de recursos

/**
 * Crea un nuevo recurso. Puede incluir un archivo.
 * @param {FormData} formData - Debe ser un objeto FormData si se incluye un archivo.
 * Contendrá campos como: titulo, descripcion, tipo_recurso,
 * enlace_url (opcional), materia_id_relacionada (opcional),
 * archivoRecurso (el archivo en sí, opcional).
 */
const crearRecurso = async (formData) => {
    try {
        // apiClient se encarga de la baseURL y de añadir el token de autenticación
        // Axios configurará automáticamente el Content-Type a 'multipart/form-data' cuando envías FormData.
        const response = await apiClient.post(API_ENDPOINT_RECURSOS, formData);
        return response.data; // Devuelve el recurso creado desde el backend
    } catch (error) {
        console.error('Error en servicio crearRecurso:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al crear el recurso');
    }
};

/**
 * Obtiene todos los recursos públicos (o según los filtros que el backend soporte).
 */
const obtenerRecursosPublicos = async () => {
    try {
        // Asume que GET /api/recursos es para recursos públicos o filtrados por el backend
        const response = await apiClient.get(API_ENDPOINT_RECURSOS); 
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerRecursosPublicos:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener recursos públicos');
    }
};

/**
 * Obtiene los recursos subidos por el asesor/usuario actualmente autenticado.
 */
const obtenerMisRecursos = async () => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT_RECURSOS}/mis-recursos`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerMisRecursos:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener mis recursos');
    }
};

/**
 * Elimina un recurso específico por su ID.
 * @param {number} id - El ID del recurso a eliminar.
 */
const eliminarRecurso = async (id) => {
    try {
        const response = await apiClient.delete(`${API_ENDPOINT_RECURSOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio eliminarRecurso:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al eliminar el recurso');
    }
};

/**
 * Obtiene un recurso específico por su ID.
 * @param {number|string} id - ID del recurso a obtener.
 */
const obtenerRecursoPorId = async (id) => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT_RECURSOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en servicio obtenerRecursoPorId:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener el recurso');
    }
};

/**
 * Actualiza un recurso existente.
 * @param {number|string} id - ID del recurso a actualizar.
 * @param {object} data - Objeto con los datos a actualizar: { titulo, descripcion, enlace, tipo }
 */
const actualizarRecurso = async (id, data) => {
    try {
        const response = await apiClient.put(`${API_ENDPOINT_RECURSOS}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error en servicio actualizarRecurso:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al actualizar el recurso');
    }
};



// Agrupamos las funciones en un objeto para exportarlas
const recursoService = {
    crearRecurso,
    obtenerRecursosPublicos,
    obtenerMisRecursos,
    eliminarRecurso,
    obtenerRecursoPorId,
    actualizarRecurso
};

export default recursoService;
