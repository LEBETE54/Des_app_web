// Archivo: frontend/src/services/authService.js
import apiClient from './apiClient'; // Asegúrate que la ruta sea correcta

const API_URL_AUTH = '/auth'; // La baseURL ('http://localhost:4000/api') ya está en apiClient

const register = async (userData) => {
    try {
        const response = await apiClient.post(`${API_URL_AUTH}/register`, userData);
        if (response.data.token && response.data.usuario) { // Verifica que el backend devuelva 'usuario'
            localStorage.setItem('studentConnectUser', JSON.stringify(response.data.usuario));
            localStorage.setItem('studentConnectToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Error en servicio de registro:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al registrar');
    }
};

const login = async (credentials) => {
    try {
        const response = await apiClient.post(`${API_URL_AUTH}/login`, credentials);
        if (response.data.token && response.data.usuario) { // Verifica que el backend devuelva 'usuario'
            localStorage.setItem('studentConnectUser', JSON.stringify(response.data.usuario));
            localStorage.setItem('studentConnectToken', response.data.token);
            // console.log('Login service: Token and user saved to localStorage'); // Para depuración
        }
        return response.data;
    } catch (error) {
        console.error('Error en servicio de login:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al iniciar sesión');
    }
};

// --- FUNCIONES CORREGIDAS/IMPLEMENTADAS ---
const logout = () => {
    localStorage.removeItem('studentConnectUser');
    localStorage.removeItem('studentConnectToken');
    // console.log('Logout service: Token and user removed from localStorage'); // Para depuración
    // No es necesario devolver nada aquí, o puedes devolver true/void
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('studentConnectUser');
    // console.log('GetCurrentUser service: userStr from localStorage:', userStr); // Para depuración
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            localStorage.removeItem('studentConnectUser'); // Limpiar si está corrupto
            return null;
        }
    }
    return null;
};

const getToken = () => {
    const token = localStorage.getItem('studentConnectToken');
    // console.log('GetToken service: token from localStorage:', token); // Para depuración
    return token;
};
// --- FIN DE FUNCIONES CORREGIDAS/IMPLEMENTADAS ---

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;