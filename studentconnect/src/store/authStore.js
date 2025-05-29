import { create } from 'zustand';
import authService from '../services/authService'; 

// Definimos el estado inicial y las acciones para nuestro store de autenticación
const useAuthStore = create((set, get) => ({
    // Estado inicial
    user: authService.getCurrentUser(),      
    token: authService.getToken(),          
    isAuthenticated: !!authService.getToken(), 
    isLoading: false,
    error: null,

    // Acción para registrar un nuevo usuario
    registerUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.register(userData); 
            set({
                user: data.usuario,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return data; 
        } catch (error) {
            const errorMessage = error.mensaje || 'Error al registrar. Intenta de nuevo.';
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

    // Acción para iniciar sesión
    loginUser: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authService.login(credentials); 
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
        authService.logout(); 
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
        
    },

   
    clearError: () => {
        set({ error: null });
    }
}));

export default useAuthStore;