import apiClient from './apiClient'; 

const API_ENDPOINT_MATERIAS = '/materias'; // Endpoint del backend para materias


const obtenerTodasLasMaterias = async () => {
    try {
        const response = await apiClient.get(API_ENDPOINT_MATERIAS);
        return response.data; 
    } catch (error) {
        console.error('Error en servicio obtenerTodasLasMaterias:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al obtener la lista de materias desde el servidor.');
    }
};

const materiaService = {
    obtenerTodasLasMaterias,
};

export default materiaService;
