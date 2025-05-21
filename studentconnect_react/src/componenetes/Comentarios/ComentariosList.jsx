import "../../styles/Comentarios/ComentariosList.css"
import ComentarioItem from "./ComentarioItem";

export default function ComentariosList() {
  const comentarios = [
    {
      nombre: "Mateo Israel Lizama",
      fecha: "12/08/2024",
      mensaje: "Este trabajo implica reparar el tejado de una casa residencial...",
      calificacion: 4
    },
    {
      nombre: "Camila Torres",
      fecha: "10/08/2024",
      mensaje: "Gracias a esta asesoría logré entender punteros.",
      calificacion: 4
    },
    {
      nombre: "Diego Fernandez",
      fecha: "10/08/2024",
      mensaje: "Buena asesoría, aunque me hubiera gustado más ejemplos prácticos.",
      calificacion: 4
    }
  ];

  return (
    <div className="space-y-6">
      <>
  {comentarios.map((comentario, index) => (
    <div key={index}>
      <ComentarioItem {...comentario} />
      {index < comentarios.length - 1 && <hr className="linea-separadora" />}
    </div>
  ))}
</>
    </div>
  );
}
