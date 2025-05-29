// Ruta: frontend/src/components/dashboard/sidebar.jsx
import React from 'react';
import '../../styles/dashboard/sidebar.css'; // Asegúrate que la ruta a tus estilos sea correcta

// Recibe el rol del usuario para mostrar opciones específicas
const Sidebar = ({ onSelect, usuarioRol, seccionActual }) => { 
  
  const getActiveClass = (seccion) => {
    return seccionActual === seccion ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul>
        {/* Opciones Comunes o para Estudiantes */}
        <li className={getActiveClass('buscar')} onClick={() => onSelect("buscar")}>
          Buscar asesorías
        </li>
        
        {usuarioRol === 'estudiante' && (
          <>
            <li className={getActiveClass('inscritas')} onClick={() => onSelect("inscritas")}>
              Asesorías Inscritas
            </li>
            <li className={getActiveClass('pendientes')} onClick={() => onSelect("pendientes")}>
              Mis Reservas (Pendientes)
            </li>
            <li className={getActiveClass('terminadasEstudiante')} onClick={() => onSelect("terminadasEstudiante")}>
              Historial Asesorías (Tomadas)
            </li>
          </>
        )}

        {/* Opciones para Asesores */}
        {usuarioRol === 'asesor' && (
          <li className={getActiveClass('crear')} onClick={() => onSelect("crear")}>
            Publicar Asesorías
          </li>
        )}
        
        {/* Opción de Recursos (puede ser común o específica) */}
        <li className={getActiveClass('recursos')} onClick={() => onSelect("recursos")}>
          Recursos Compartidos
        </li>

        {/* Puedes añadir más opciones aquí, como "Mi Perfil", etc. */}
      </ul>
    </aside>
  );
};

export default Sidebar;
