// Ruta: frontend/src/components/dashboard/sidebar.jsx
import React from 'react';
import '../../styles/dashboard/sidebar.css'; 

const Sidebar = ({ onSelect, usuarioRol, seccionActual }) => { 
  
  const getActiveClass = (seccion) => {
    return seccionActual === seccion ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul>
        {/* Opciones para Estudiantes */}
        <li className={getActiveClass('buscar')} onClick={() => onSelect("buscar")}>
          Buscar asesorías
        </li>
        
        {usuarioRol === 'estudiante' && (
          <>
            <li className={getActiveClass('inscritas')} onClick={() => onSelect("inscritas")}>
              Asesorías Inscritas
            </li>
          </>
        )}

        {/* Opciones para Asesores */}
        {usuarioRol === 'asesor' && (
          <li className={getActiveClass('crear')} onClick={() => onSelect("crear")}>
            Publicar Asesorías
          </li>
        )}
        
        <li className={getActiveClass('recursos')} onClick={() => onSelect("recursos")}>
          Recursos Compartidos
        </li>

        {/* Puedes añadir más opciones aquí, como "Mi Perfil", etc. */}
      </ul>
    </aside>
  );
};

export default Sidebar;
