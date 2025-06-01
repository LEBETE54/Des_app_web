import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/dashboard'; 
import Register from './pages/Register';
import GestionarHorarios from './pages/GestionarHorarios';
import useAuthStore from './store/authStore';
import PerfilUsuario from './components/PerfilUsuario';
import AdministracionAsesorias from './components/AdministracionAsesorias';

// Componente para proteger rutas
const ProtectedRoute = ({ children, rolesPermitidos }) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && rolesPermitidos.length > 0 && !rolesPermitidos.includes(user?.rol)) {

        console.warn(`Acceso denegado a la ruta. Usuario rol: ${user?.rol}, Roles permitidos: ${rolesPermitidos}`);
        return <Navigate to="/dashboard" replace />; 
    }

    return children; 
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
            path="/perfil" 
            element={
                <ProtectedRoute>
                    <PerfilUsuario />
                </ProtectedRoute>
            } 
        />

        <Route 
            path="/gestionar-horarios" 
            element={
                <ProtectedRoute> {/* Solo para usuarios con rol 'asesor' */}
                    <AdministracionAsesorias />
                </ProtectedRoute>
            } 
        />
        
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
  