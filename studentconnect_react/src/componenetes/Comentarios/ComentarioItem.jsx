import "../../styles/Comentarios/ComentarioItem.css";

export default function ComentarioItem({ nombre, fecha, mensaje, calificacion }) {
  return (
    <div className="comentario">
      <img
        alt={`Foto de ${nombre}`}
        src="/imagenes/usuario.png"
        className="foto-usuario"
      />
      <div className="contenido">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{nombre}</h3>
          <span className="fecha">{fecha}</span>
        </div>
        <p>{mensaje}</p>
        <div className="estrellas">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fas fa-star ${i < calificacion ? "" : "text-gray-300"}`}
            ></i>
          ))}
        </div>
      </div>
    </div>
  );
}
