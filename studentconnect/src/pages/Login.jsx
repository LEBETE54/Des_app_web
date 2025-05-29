import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Home/NavBarHome.jsx"; // Asegúrate que la ruta sea correcta
import useAuthStore from '../store/authStore'; // Importamos nuestro store de Zustand
import '../styles/Login/Login.css'; // Asegúrate que la ruta a tus estilos sea correcta

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');

    // Obtenemos las funciones y el estado de nuestro store
    const loginUser = useAuthStore((state) => state.loginUser);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    useEffect(() => {
        // Si el usuario ya está autenticado (ej. por recargar la página con un token válido),
        // lo redirigimos al dashboard.
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        // Limpiar errores cuando el componente se monta o isAuthenticated cambia
        return () => {
            clearError();
        };
    }, [isAuthenticated, navigate, clearError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        clearError(); // Limpiamos errores previos antes de un nuevo intento

        try {
            await loginUser({ correo, contrasenia });
            // La navegación ahora se maneja con el useEffect de arriba cuando isAuthenticated cambie a true
        } catch (err) {
            // El error ya se maneja y se establece en el store,
            // así que no necesitamos hacer mucho aquí, solo evitar que la consola muestre un error no capturado.
            console.error("Fallo en el intento de login:", err.mensaje || err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="main1">
                <form className="desc" onSubmit={handleLogin}>
                    <h1>Inicia sesión</h1>
                    {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
                    <input
                        type="email" // Cambiado a email para mejor validación y UX
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button className="Login" type="submit" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;