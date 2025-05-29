import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Home/NavBarHome.jsx";
import useAuthStore from '../store/authStore';
// Ya no necesitas shallow si seleccionas individualmente
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

    // Seleccionamos cada pieza individualmente
    const registerUser = useAuthStore(state => state.registerUser);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);
    const clearError = useAuthStore(state => state.clearError);
    const logoutUser = useAuthStore(state => state.logoutUser);
    const user = useAuthStore(state => state.user);

    // Tus console.log para depuración
    // console.log('[Register.jsx] Montado/Actualizado. isAuthenticated:', isAuthenticated, 'registrationSuccess:', registrationSuccess, 'user:', user, 'error:', error, 'isLoading:', isLoading);

    useEffect(() => {
        // console.log('[Register.jsx] useEffect post-registro. registrationSuccess:', registrationSuccess, 'isAuthenticated:', isAuthenticated);
        if (registrationSuccess && isAuthenticated) {
            // console.log('[Register.jsx] Redirigiendo a dashboard...');
            navigate('/dashboard');
        }
    }, [registrationSuccess, isAuthenticated, navigate]);

    useEffect(() => {
        // console.log('[Register.jsx] useEffect limpieza errores. Montando.');
        // Limpiar errores al montar si vienes de otra página que pudo dejar un error
        if (error) {
            clearError();
        }
        return () => { // Limpiar errores al desmontar
            // console.log('[Register.jsx] useEffect limpieza errores. Desmontando.');
            clearError();
        };
    }, [clearError, error]); // <- Añadido error a las dependencias por la limpieza en montaje

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogoutAndClearForm = () => {
        // console.log('[Register.jsx] handleLogoutAndClearForm llamado.');
        logoutUser();
        setFormData({
            nombre_completo: '', correo: '', contrasenia: '', confirmarContrasenia: '',
            rol: 'estudiante', carrera: '', semestre: '', telefono: ''
        });
        // clearError(); // clearError se llamará por el useEffect al cambiar isAuthenticated o al desmontar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // clearError(); // Se limpiará al inicio del efecto si hay error

        if (formData.contrasenia !== formData.confirmarContrasenia) {
            // En lugar de usar useAuthStore.setState directamente, es mejor tener una acción en el store si fuera un error global
            // o manejarlo como un error local si es solo de UI.
            // Por ahora, para simplificar, podemos mostrar un error local o usar el global si lo ajustamos.
            // Vamos a dejar que el store maneje el error si el backend lo devuelve por esto.
            // O, si queremos un error de UI inmediato:
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
                    
                    <select name="rol" value={formData.rol} onChange={handleChange} disabled={isLoading} style={{marginBottom: '15px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%'}}>
                        <option value="estudiante">Soy Estudiante</option>
                        <option value="asesor">Quiero ser Asesor</option>
                    </select>
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