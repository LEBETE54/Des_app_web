import Navbar from "../componenetes/Recursos/navbar";
import ComentariosList from "../componenetes/Comentarios/ComentariosList";
import ComentarioForm from "../componenetes/Comentarios/ComentarioForm";
import "../styles/Comentarios/Global.css"; // dentro de ComentarioItem.jsx


export default function Comentarios() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Comentarios Sobre Introducción a C++</h1>
        <p className="text-gray-700 mb-6">
          El proyecto consiste en aprender lo más básico de este lenguaje de programación desde cero, hasta un nivel avanzado y aplicarlo en tus propios proyectos.
        </p>

        <h2 className="text-xl font-bold mb-4">Comentarios</h2>
        <ComentariosList />

        <h2 className="text-xl font-bold mt-6 mb-4">Deja tu comentario</h2>
        <ComentarioForm />
      </div>
    </>
  );
}
