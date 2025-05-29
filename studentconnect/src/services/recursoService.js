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

// Agrupamos las funciones en un objeto para exportarlas
const recursoService = {
    crearRecurso,
    obtenerRecursosPublicos,
    obtenerMisRecursos,
    eliminarRecurso,
    // Aquí podrías añadir más funciones en el futuro, como actualizarRecurso(id, data)
};

// Exportamos el objeto como la exportación por defecto del módulo
export default recursoService;
