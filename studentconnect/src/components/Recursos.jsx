import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import recursoService from '../services/recursoService';
import materiaService from '../services/materiaService';
import '../styles/Recursos.css'; 

const Recursos = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user); 
    const userRol = useAuthStore(state => state.user?.rol); // Específicamente el rol para lógica

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [enlaceUrl, setEnlaceUrl] = useState('');
    const [tipoRecursoForm, setTipoRecursoForm] = useState('documento_pdf'); 
    const [archivo, setArchivo] = useState(null);
    const [materiaId, setMateriaId] = useState('');

    const [recursosList, setRecursosList] = useState([]); 
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const esAsesor = isAuthenticated && userRol === 'asesor';

    const cargarRecursos = useCallback(async () => {
        try {
            let data;
            if (esAsesor) { 
                data = await recursoService.obtenerMisRecursos(); 
            } else { 
                data = await recursoService.obtenerRecursosPublicos();
            }
            setRecursosList((data || []).sort((a,b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)));
        } catch (err) {
            setError(err.mensaje || `Error al cargar recursos.`);
            setRecursosList([]);
        }
    }, [esAsesor]); 

    useEffect(() => {
        const cargarDataInicial = async () => {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');

            if (esAsesor) {
                try {
                    const materiasData = await materiaService.obtenerTodasLasMaterias();
                    setMaterias(materiasData || []);
                } catch (err) {
                    console.error("Error al cargar materias para recursos:", err);
                    setError(prev => prev + (prev ? "; " : "") + (err.mensaje || 'Error al cargar lista de materias.'));
                    setMaterias([]);
                }
            }
            await cargarRecursos();
            setIsLoading(false);
        };
        cargarDataInicial();
    }, [esAsesor, cargarRecursos]); 

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const limpiarFormulario = () => {
        setTitulo('');
        setDescripcion('');
        setEnlaceUrl('');
        setTipoRecursoForm('documento_pdf');
        setArchivo(null);
        setMateriaId('');
        if (document.getElementById('archivoRecursoInput')) {
            document.getElementById('archivoRecursoInput').value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!titulo || !tipoRecursoForm) {
            setError('El título y el tipo de recurso son obligatorios.');
            return;
        }
        if ((tipoRecursoForm === 'video' || tipoRecursoForm === 'articulo_web') && !enlaceUrl) {
            setError('Para videos o enlaces web, la URL es obligatoria.');
            return;
        }
        if ((tipoRecursoForm === 'documento_pdf' || tipoRecursoForm === 'imagen') && !archivo && !enlaceUrl) {
            setError('Para PDF o imagen, debes subir un archivo o proporcionar un enlace externo.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('tipo_recurso', tipoRecursoForm); // Usar el estado del formulario
        if (enlaceUrl) formData.append('enlace_url', enlaceUrl);
        if (materiaId) formData.append('materia_id_relacionada', materiaId);
        if (archivo) formData.append('archivoRecurso', archivo);

        try {
            const recursoCreado = await recursoService.crearRecurso(formData);
            setRecursosList(prev => [recursoCreado, ...prev].sort((a,b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)));
            setSuccessMessage('¡Recurso creado exitosamente!');
            limpiarFormulario();
        } catch (err) {
            setError(err.mensaje || 'Error al crear el recurso.');
        }
        setIsLoading(false);
    };

    const handleEliminarRecurso = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este recurso?")) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await recursoService.eliminarRecurso(id);
            setRecursosList(prev => prev.filter(r => r.id !== id));
            setSuccessMessage('Recurso eliminado exitosamente.');
        } catch (err) {
            setError(err.mensaje || 'Error al eliminar el recurso.');
        }
        setIsLoading(false);
    };
    
    const obtenerIconoRecurso = (tipoParam) => { // Renombrado el parámetro para evitar colisión
        switch (tipoParam) {
            case 'documento_pdf': return '📄';
            case 'video': return '▶️';
            case 'articulo_web': return '🔗';
            case 'imagen': return '🖼️';
            default: return '📁';
        }
    };

    return (
        <div className="recursos-container"> 
            <h1>Recursos Compartidos</h1>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {esAsesor && (
                <form onSubmit={handleSubmit} className="recurso-form">
                    <h2>Subir Nuevo Recurso</h2>
                    <div>
                        <label htmlFor="titulo">Nombre del Recurso:</label>
                        <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="descripcion">Descripción (Opcional):</label>
                        <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} disabled={isLoading}></textarea>
                    </div>
                    <div>
                        <label htmlFor="tipoRecursoFormInput">Tipo de Recurso:</label>
                        <select id="tipoRecursoFormInput" value={tipoRecursoForm} onChange={(e) => setTipoRecursoForm(e.target.value)} required disabled={isLoading}>
                            <option value="documento_pdf">PDF</option>
                            <option value="video">Video (Enlace)</option>
                            <option value="articulo_web">Artículo/Enlace Web</option>
                            <option value="imagen">Imagen</option>
                        </select>
                    </div>

                    {(tipoRecursoForm === 'documento_pdf' || tipoRecursoForm === 'imagen') && (
                        <div>
                            <label htmlFor="archivoRecursoInput">Subir Archivo (Opcional si provee enlace):</label>
                            <input type="file" id="archivoRecursoInput" onChange={handleFileChange} disabled={isLoading} />
                        </div>
                    )}

                    {(tipoRecursoForm === 'video' || tipoRecursoForm === 'articulo_web' || ((tipoRecursoForm === 'documento_pdf' || tipoRecursoForm === 'imagen') && !archivo) ) && (
                        <div>
                            <label htmlFor="enlaceUrl">Enlace URL {tipoRecursoForm === 'video' || tipoRecursoForm === 'articulo_web' ? '(Obligatorio)' : '(Opcional si sube archivo)'}:</label>
                            <input type="url" id="enlaceUrl" value={enlaceUrl} onChange={(e) => setEnlaceUrl(e.target.value)} placeholder="http://..." disabled={isLoading} />
                        </div>
                    )}
                    
                    {materias.length > 0 && (
                        <div>
                            <label htmlFor="materiaIdRecurso">Asociar a Materia (Opcional):</label>
                            <select id="materiaIdRecurso" value={materiaId} onChange={(e) => setMateriaId(e.target.value)} disabled={isLoading}>
                                <option value="">-- Ninguna en particular --</option>
                                {materias.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}>{isLoading ? 'Subiendo...' : 'Agregar Recurso'}</button>
                </form>
            )}

            <h2>Recursos Disponibles</h2>
            {isLoading && recursosList.length === 0 && <p>Cargando recursos...</p>}
            {!isLoading && recursosList.length === 0 && <p>No hay recursos disponibles por el momento.</p>}
            
            <div className="lista-recursos">
                {recursosList.map(recurso => (
                    <div key={recurso.id} className="recurso-card">
                        <h3>{obtenerIconoRecurso(recurso.tipo_recurso)} {recurso.titulo}</h3>
                        {recurso.nombre_materia && <p><small>Materia: {recurso.nombre_materia}</small></p>}
                        <p>{recurso.descripcion || 'Sin descripción.'}</p>
                        <p><small>Subido por: {recurso.nombre_autor || 'N/A'} el {new Date(recurso.fecha_publicacion).toLocaleDateString()}</small></p>
                        
                        <div className="recurso-actions">
                            {recurso.archivo_adjunto_url && (
                                <a href={`http://localhost:4000${recurso.archivo_adjunto_url}`} target="_blank" rel="noopener noreferrer" download className="btn-recurso">
                                    Descargar {recurso.tipo_recurso.includes('pdf') ? 'PDF' : 'Archivo'}
                                </a>
                            )}
                            {recurso.enlace_url && (
                                <a href={recurso.enlace_url} target="_blank" rel="noopener noreferrer" className="btn-recurso" style={{marginLeft: recurso.archivo_adjunto_url ? '10px' : '0'}}>
                                    {recurso.tipo_recurso === 'video' ? 'Ver Video' : 'Ir al Enlace'}
                                </a>
                            )}
                        </div>
                        {esAsesor && recurso.usuario_id_autor === user.id && (
                             <button onClick={() => handleEliminarRecurso(recurso.id)} disabled={isLoading} className="btn-eliminar-recurso">Eliminar</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recursos;
