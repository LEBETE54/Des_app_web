// Ruta completa: frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/dashboard'; // Asegúrate que el nombre del archivo sea 'dashboard.jsx' o 'Dashboard.jsx'
import Register from './pages/Register';
import GestionarHorarios from './pages/GestionarHorarios';
import useAuthStore from './store/authStore';

// Componente para proteger rutas
const ProtectedRoute = ({ children, rolesPermitidos }) => {
    // Usamos el hook dentro del componente o getState si es estrictamente necesario fuera de un render
    // Para este caso, como es un componente, podemos usar el hook directamente.
    // Sin embargo, para evitar problemas con el "Maximum update depth" si se usa incorrectamente,
    // leer el estado directamente con getState() dentro de la lógica de render es más seguro aquí.
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);

    if (!isAuthenticated) {
        // Si no está autenticado, redirigir a login
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && rolesPermitidos.length > 0 && !rolesPermitidos.includes(user?.rol)) {
        // Si se especifican roles y el usuario no tiene un rol permitido,
        // redirigir al dashboard (o a una página de "acceso denegado" general)
        console.warn(`Acceso denegado a la ruta. Usuario rol: ${user?.rol}, Roles permitidos: ${rolesPermitidos}`);
        return <Navigate to="/dashboard" replace />; 
    }

    return children; // Si está autenticado y tiene el rol (si se especifica), renderizar el componente hijo
};

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Protegidas */}
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/gestionar-horarios" // <--- RUTA EN MINÚSCULAS
            element={
                <ProtectedRoute rolesPermitidos={['asesor']}> {/* Solo para usuarios con rol 'asesor' */}
                    <GestionarHorarios />
                </ProtectedRoute>
            } 
        />
        
        {/* Puedes añadir una ruta "catch-all" para páginas no encontradas si lo deseas */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Página No Encontrada</h1>
            <Link to="/">Volver al Inicio</Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
  