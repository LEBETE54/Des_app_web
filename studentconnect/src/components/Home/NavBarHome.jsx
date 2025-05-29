// Ruta completa: frontend/src/components/Home/NavBarHome.jsx

import logo from "../../assets/LogoV2.svg"; // Ajusta la ruta a tu logo
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
// shallow ya no es estrictamente necesario aquí si seleccionamos individualmente
import "../../styles/Home/NavBarHome.css"; // Ajusta la ruta a tus estilos

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logoutUser = useAuthStore(state => state.logoutUser);

    const handleLogout = () => {
        logoutUser();
        setMenuOpen(false);
        navigate('/login'); 
    };

    return (
        <header>
            <div className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="StudentConnect Logo" />
                    </Link>
                </div>
                <ul className="links">
                    {isAuthenticated ? (
                        <>
                            {user && <li className="welcome-user"><span>Hola, {user.nombre_completo || user.correo}</span></li>}
                            <li>
                                <Link className="action_btn" to="/dashboard">Dashboard</Link>
                            </li>
                            {user && user.rol === 'asesor' && ( // Enlace solo para asesores
                                <li>
                                    <Link className="action_btn" to="/gestionar-horarios">Mis Horarios</Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="action_btn Logout">Cerrar Sesión</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link className="action_btn Registrarse" to="/register">Registrarse</Link>
                            </li>
                            <li>
                                <Link className="action_btn Login" to="/login">Iniciar Sesión</Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className="toggle_btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i> {/* Asegúrate de tener FontAwesome si usas estas clases */}
                </div>
            </div>

            {menuOpen && (
                <div className="dropdown_menu"> {/* Adapta esta clase y contenido a tu diseño */}
                    {isAuthenticated ? (
                        <>
                            {user && <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Hola, {user.nombre_completo || user.correo}</Link></li>}
                            <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                            {user && user.rol === 'asesor' && (
                                <li><Link to="/gestionar-horarios" onClick={() => setMenuOpen(false)}>Mis Horarios</Link></li>
                            )}
                            <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register" onClick={() => setMenuOpen(false)}>Registrarse</Link></li>
                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link></li>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
