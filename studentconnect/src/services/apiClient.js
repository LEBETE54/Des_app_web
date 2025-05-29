import axios from 'axios';
import useAuthStore from '../store/authStore'; // Para obtener el token y la acción de logout

// 1. CREAR UNA INSTANCIA DE AXIOS
// Aquí configuramos la URL base para todas las llamadas a tu API.
// Si tu backend corre en http://localhost:4000 y todas tus rutas de API empiezan con /api,
// entonces la baseURL sería 'http://localhost:4000/api'.
const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api', // ¡Asegúrate que esta sea la URL base correcta de tu backend!
    // Podrías añadir otros headers por defecto aquí si fueran necesarios globalmente:
    // headers: {
    //   'Content-Type': 'application/json', // Axios lo hace por defecto para POST/PUT con objetos
    // }
});

// 2. INTERCEPTOR DE SOLICITUD (REQUEST INTERCEPTOR)
// Esta función se ejecutará ANTES de que cada solicitud sea enviada desde tu frontend.
apiClient.interceptors.request.use(
    (config) => {
        // Intentamos obtener el token del store de Zustand.
        // getState() nos permite acceder al estado del store fuera de un componente React.
        const token = useAuthStore.getState().token;

        if (token) {
            // Si existe un token, lo añadimos al header 'x-auth-token'.
            // Este es el header que nuestro authMiddleware en el backend espera.
            config.headers['x-auth-token'] = token;
        }
        // console.log('[ApiClient Request] Enviando config:', config); // Descomenta para depurar
        return config; // Devolvemos la configuración (modificada o no) para que la solicitud continúe.
    },
    (error) => {
        // Si hay un error al configurar la solicitud (raro, pero posible).
        console.error('[ApiClient Request] Error en interceptor:', error);
        return Promise.reject(error);
    }
);

// 3. (OPCIONAL PERO RECOMENDADO) INTERCEPTOR DE RESPUESTA (RESPONSE INTERCEPTOR)
// Esta función se ejecutará DESPUÉS de recibir una respuesta del servidor,
// pero ANTES de que tu código que hizo la llamada (ej. en horarioService) la reciba.
apiClient.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa (status 2xx), simplemente la devolvemos.
        // console.log('[ApiClient Response] Respuesta recibida:', response); // Descomenta para depurar
        return response;
    },
    (error) => {
        // Si la respuesta es un error (status no es 2xx).
        console.error('[ApiClient Response] Error en respuesta:', error.response); // Descomenta para depurar

        if (error.response && error.response.status === 401) {
            // Error 401 significa "No Autorizado". Puede ser que el token sea inválido o haya expirado.
            // En este caso, es una buena práctica desloguear al usuario automáticamente.
            console.warn('[ApiClient Response] Error 401 - No autorizado. Deslogueando usuario.');

            const { logoutUser, isAuthenticated } = useAuthStore.getState();

            // Solo desloguear si realmente estaba autenticado, para evitar efectos extraños
            if (isAuthenticated) {
                logoutUser(); 
                // Considera cómo quieres manejar la redirección aquí.
                // window.location.href = '/login'; es una opción, pero puede ser un poco brusco.
                // Otra opción es que los componentes que dependen de `isAuthenticated` reaccionen
                // y redirijan usando `useNavigate`.
            }
        }
        // Devolvemos el error para que pueda ser manejado por la función que hizo la llamada original
        // (ej. el .catch() en tu servicio horarioService).
        return Promise.reject(error);
    }
);

// 4. EXPORTAR LA INSTANCIA CONFIGURADA
export default apiClient;