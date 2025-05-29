// Ruta: frontend/src/services/materiaService.js

import apiClient from './apiClient'; // Tu instancia configurada de Axios

const API_ENDPOINT_MATERIAS = '/materias'; // Endpoint del backend para materias

/**
 * Obtiene todas las materias desde el backend.
 * Se espera que el backend devuelva un array de objetos materia,
 * cada uno con al menos 'id' y 'nombre'.
 * Ejemplo: [{ id: 1, nombre: 'Cálculo Diferencial' }, { id: 2, nombre: 'Programación Orientada a Objetos' }]
 */
const obtenerTodasLasMaterias = async () => {
    try {
        // apiClient se encarga de la baseURL y de añadir el token de autenticación si es necesario
        const response = await apiClient.get(API_ENDPOINT_MATERIAS);
        return response.data; 
    } catch (error) {
        console.error('Error en servicio obtenerTodasLasMaterias:', error.response ? error.response.data : error.message);
        // Relanzamos el error para que el componente que llama (GestionarHorarios.jsx) pueda manejarlo
        throw error.response ? error.response.data : new Error('Error al obtener la lista de materias desde el servidor.');
    }
};

const materiaService = {
    obtenerTodasLasMaterias,
    // Aquí podrías añadir más funciones en el futuro si las necesitas,
    // por ejemplo, para que un administrador cree nuevas materias.
};

export default materiaService;
