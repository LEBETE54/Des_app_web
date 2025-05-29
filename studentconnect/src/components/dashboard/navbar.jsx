// Ruta: frontend/src/components/dashboard/navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Ajusta la ruta si es necesario
// Importa tus estilos para este navbar específico del dashboard
import '../../styles/dashboard/DashboardNavbar.css'; // Crearemos este archivo CSS

const NavBar = () => {
    // Seleccionamos individualmente para evitar re-renders innecesarios
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logoutUser = useAuthStore(state => state.logoutUser);
    
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logoutUser();
        setDropdownOpen(false);
        navigate('/login'); // Redirigir a la página de login después de cerrar sesión
    };

    // Cerrar dropdown si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Placeholder para la imagen de perfil, usa la real si la tienes en user.foto_perfil_url
    const profileImageUrl = user?.foto_perfil_url || '/default-avatar.png'; // Usa un avatar por defecto

    return (
        <header className="dashboard-navbar-header">
            <div className="navbar-content">
                <div className="navbar-left">
                    <Link to="/dashboard" className="navbar-logo-link">
                        <img src="/LogoV2.svg" alt="Logo StudentConnect" className="navbar-logo" />
                        <span className="navbar-title">StudentConnect</span>
                    </Link>
                    {/* Podrías añadir un breadcrumb o título de sección aquí si es necesario */}
                </div>

                <div className="navbar-right">
                    {isAuthenticated && user ? (
                        <div className="user-menu" ref={dropdownRef}>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)} 
                                className="user-menu-button"
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                            >
                                <img 
                                    src={profileImageUrl} 
                                    alt={user.nombre_completo || user.correo} 
                                    className="user-avatar" 
                                    onError={(e) => { e.target.onerror = null; e.target.src='/default-avatar.png'; }} // Fallback si la imagen falla
                                />
                                <span className="user-name">{user.nombre_completo || user.correo}</span>
                                <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <ul className="dropdown-content">
                                    <li>
                                        <Link to="/perfil" onClick={() => setDropdownOpen(false)}>Mi Perfil</Link> 
                                        {/* Necesitarás crear la ruta y el componente /perfil */}
                                    </li>
                                    {user.rol === 'asesor' && (
                                        <li>
                                            <Link to="/gestionar-horarios" onClick={() => setDropdownOpen(false)}>Mis Asesorías</Link>
                                        </li>
                                    )}
                                    {/* Puedes añadir más enlaces aquí, ej. Configuración */}
                                    <li>
                                        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="navbar-login-button">Iniciar Sesión</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
