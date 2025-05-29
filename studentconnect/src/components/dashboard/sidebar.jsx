import React from 'react';
import '../../styles/dashboard/sidebar.css'; // Asegúrate que la ruta a tus estilos sea correcta

const Sidebar = ({ onSelect, usuarioRol, seccionActual }) => { 
  
  const getActiveClass = (seccion) => {
    return seccionActual === seccion ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul>
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

        {usuarioRol === 'asesor' && (
          <li className={getActiveClass('crear')} onClick={() => onSelect("crear")}>
            Publicar Asesorías
          </li>
        )}
        
        <li className={getActiveClass('recursos')} onClick={() => onSelect("recursos")}>
          Recursos Compartidos
        </li>

      </ul>
    </aside>
  );
};

export default Sidebar;
