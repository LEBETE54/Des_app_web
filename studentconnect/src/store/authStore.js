import { create } from 'zustand';
import authService from '../services/authService'; // Asegúrate que la ruta al servicio sea correcta

// Definimos el estado inicial y las acciones para nuestro store de autenticación
const useAuthStore = create((set, get) => ({
    // Estado inicial
    user: authService.getCurrentUser(),      // Intentamos cargar el usuario desde localStorage al inicio
    token: authService.getToken(),          // Intentamos cargar el token desde localStorage al inicio
    isAuthenticated: !!authService.getToken(), // Será true si hay un token al inicio
    isLoading: false,
    error: null,

    // Acción para registrar un nuevo usuario
    registerUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.register(userData); // El servicio ya guarda en localStorage
            set({
                user: data.usuario,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return data; // Devuelve la respuesta completa por si el componente la necesita
        } catch (error) {
            const errorMessage = error.mensaje || 'Error al registrar. Intenta de nuevo.';
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
            });
            throw error; // Relanzamos el error para que el componente lo maneje si es necesario
        }
    },

    // Acción para iniciar sesión
    loginUser: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.login(credentials); // El servicio ya guarda en localStorage
            set({
                user: data.usuario,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return data;
        } catch (error) {
            const errorMessage = error.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.';
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
            });
            throw error;
        }
    },

    // Acción para cerrar sesión
    logoutUser: () => {
        authService.logout(); // El servicio limpia localStorage
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
        // Aquí podrías redirigir al usuario a la página de inicio o login si es necesario
        // window.location.href = '/login'; (no siempre es la mejor práctica hacerlo desde el store)
    },


    // Acción para limpiar errores manualmente si es necesario
    clearError: () => {
        set({ error: null });
    }
}));

export default useAuthStore;