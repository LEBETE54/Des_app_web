import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard/sidebar.css';

const Sidebar = ({ activeSection }) => {
  return (
    <div className="dashboard-sidebar">
      <nav>
        <ul>
          <li className={activeSection === 'perfil' ? 'active' : ''}>
            <Link to="/dashboard">
              <i className="fas fa-user"></i> Mi Perfil
            </Link>
          </li>
          <li className={activeSection === 'buscar' ? 'active' : ''}>
            <Link to="/dashboard/buscar-asesorias">
              <i className="fas fa-search"></i> Buscar Asesoría
            </Link>
          </li>
          <li className={activeSection === 'mis-asesorias' ? 'active' : ''}>
            <Link to="/dashboard/mis-asesorias">
              <i className="fas fa-list"></i> Mis Asesorías
            </Link>
          </li>
          <li className={activeSection === 'recursos' ? 'active' : ''}>
            <Link to="/dashboard/recursos">
              <i className="fas fa-book"></i> Recursos
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;