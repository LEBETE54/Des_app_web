import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Home/NavBarHome.jsx";
import useAuthStore from '../store/authStore';
import '../styles/Login/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo: '',
        contrasenia: '',
        confirmarContrasenia: '',
        rol: 'estudiante',
        carrera: '',
        semestre: '',
        telefono: ''
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const registerUser = useAuthStore(state => state.registerUser);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);
    const clearError = useAuthStore(state => state.clearError);
    const logoutUser = useAuthStore(state => state.logoutUser);
    const user = useAuthStore(state => state.user);

    useEffect(() => {
        if (registrationSuccess && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [registrationSuccess, isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            clearError();
        }
        return () => { 
            clearError();
        };
    }, [clearError, error]); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogoutAndClearForm = () => {
        logoutUser();
        setFormData({
            nombre_completo: '', correo: '', contrasenia: '', confirmarContrasenia: '',
            rol: 'estudiante', carrera: '', semestre: '', telefono: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.contrasenia !== formData.confirmarContrasenia) {
            useAuthStore.setState({ error: 'Las contraseñas no coinciden.' }); // Temporal, idealmente manejar errores de UI localmente o con una acción específica
            return;
        }

        const { confirmarContrasenia, ...userData } = formData;
        const finalUserData = {
            ...userData,
            semestre: userData.semestre ? parseInt(userData.semestre, 10) : null,
        };

        try {
            await registerUser(finalUserData);
            setRegistrationSuccess(true);
        } catch (err) {
            // console.error("Fallo en el intento de registro:", err.mensaje || err);
            setRegistrationSuccess(false);
        }
    };
    
    // console.log(`Renderizando Register. isAuthenticated: ${isAuthenticated}, registrationSuccess: ${registrationSuccess}`);

    if (isAuthenticated && !registrationSuccess) {
        // console.log('[Register.jsx] Renderizando mensaje de sesión activa.');
        return (
            <>
                <Navbar />
                <div className="main1" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <div className="desc" style={{ maxWidth: '500px', margin: 'auto' }}>
                        <h1>Ya tienes una sesión activa</h1>
                        {user && <p>Hola, {user.nombre_completo || user.correo}.</p>}
                        <p>Parece que ya has iniciado sesión.</p>
                        <Link to="/dashboard" className="Login" style={{ display: 'inline-block', marginRight: '10px', textDecoration: 'none' }}>
                            Ir a mi Dashboard
                        </Link>
                        <button 
                            onClick={handleLogoutAndClearForm} 
                            className="Login"
                            style={{ display: 'inline-block', background: '#6c757d' }}
                        >
                            Cerrar sesión y Registrar otra cuenta
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // console.log('[Register.jsx] Renderizando formulario de registro.');
    return (
        <>
            <Navbar />
            <div className="main1">
                <form className="desc" onSubmit={handleSubmit}>
                    <h1>Crear Cuenta</h1>
                    {/* Mostrar error solo si no estamos en proceso de redirigir por éxito */}
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                    <input type="text" name="nombre_completo" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={handleChange} required disabled={isLoading} />
                    <input type="email" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} required disabled={isLoading} />
                    <input type="password" name="contrasenia" placeholder="Contraseña" value={formData.contrasenia} onChange={handleChange} required disabled={isLoading} />
                    <input type="password" name="confirmarContrasenia" placeholder="Confirmar Contraseña" value={formData.confirmarContrasenia} onChange={handleChange} required disabled={isLoading} />
                    <input type="text" name="carrera" placeholder="Carrera (opcional)" value={formData.carrera} onChange={handleChange} disabled={isLoading} />
                    <input type="number" name="semestre" placeholder="Semestre (opcional, ej: 5)" value={formData.semestre} onChange={handleChange} disabled={isLoading} />
                    <input type="tel" name="telefono" placeholder="Teléfono (opcional)" value={formData.telefono} onChange={handleChange} disabled={isLoading} />

                    <button className="Login" type="submit" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarme'}
                    </button>
                    <p style={{ marginTop: '15px' }}>
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Register;