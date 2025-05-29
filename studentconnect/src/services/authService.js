import apiClient from './apiClient'; 

const API_URL_AUTH = '/auth'; // 

const register = async (userData) => {
    try {
        const response = await apiClient.post(`${API_URL_AUTH}/register`, userData);
        if (response.data.token && response.data.usuario) { 
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
        }
        return response.data;
    } catch (error) {
        console.error('Error en servicio de login:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Error al iniciar sesión');
    }
};

const logout = () => {
    localStorage.removeItem('studentConnectUser');
    localStorage.removeItem('studentConnectToken');
    
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('studentConnectUser');
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
    return token;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;