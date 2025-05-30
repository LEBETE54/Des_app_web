// frontend/src/components/dashboard/sidebar.jsx
import React from 'react';
import '../../styles/dashboard/sidebar.css'; 

const Sidebar = ({ onSelect, seccionActual }) => {
  const getActiveClass = (seccion) => {
    return seccionActual === seccion ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul>
        <li className={getActiveClass('buscar')} onClick={() => onSelect("buscar")}>
          Buscar asesorías
        </li>
        
        <li className={getActiveClass('inscritas')} onClick={() => onSelect("inscritas")}>
          Asesorías Inscritas
        </li>
        
        <li className={getActiveClass('crear')} onClick={() => onSelect("crear")}>
          Publicar Asesorías
        </li>
        
        <li className={getActiveClass('recursos')} onClick={() => onSelect("recursos")}>
          Recursos Compartidos
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

