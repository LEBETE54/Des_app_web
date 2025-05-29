import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Home/NavBarHome.jsx";
import useAuthStore from '../store/authStore'; 
import '../styles/Login/Login.css'; 

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');

    const loginUser = useAuthStore((state) => state.loginUser);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    useEffect(() => {
        
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        return () => {
            clearError();
        };
    }, [isAuthenticated, navigate, clearError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        clearError(); 

        try {
            await loginUser({ correo, contrasenia });
        } catch (err) {
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