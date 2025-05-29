import axios from 'axios';
import useAuthStore from '../store/authStore'; 


const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api', 
});


apiClient.interceptors.request.use(
    (config) => {
        
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config; 
    },
    (error) => {
        console.error('[ApiClient Request] Error en interceptor:', error);
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('[ApiClient Response] Error en respuesta:', error.response); 

        if (error.response && error.response.status === 401) {
            // Error 401 significa "No Autorizado". Puede ser que el token sea inválido o haya expirado.
            console.warn('[ApiClient Response] Error 401 - No autorizado. Deslogueando usuario.');

            const { logoutUser, isAuthenticated } = useAuthStore.getState();

            if (isAuthenticated) {
                logoutUser(); 
                
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;