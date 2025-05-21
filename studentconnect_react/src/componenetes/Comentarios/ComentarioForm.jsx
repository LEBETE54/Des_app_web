import "../../styles/Comentarios/ComentarioForm.css"
export default function ComentarioForm() {
  return (
    <div className="space-y-4 mt-6">
      <div>
        <label htmlFor="calificacion" className="block text-gray-700">
          Calificación
        </label>
        <select id="calificacion" className="w-full border border-gray-300 rounded-md p-2">
          <option>Calificación</option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n} estrella{n > 1 && "s"}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comentario" className="block text-gray-700">
          Comentario
        </label>
        <textarea
          id="comentario"
          placeholder="Escribe tu comentario..."
          className="w-full border border-gray-300 rounded-md p-2"
        ></textarea>
      </div>
      <div className="flex gap-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          Enviar Comentario
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
          Regresar
        </button>
      </div>
    </div>
  );
}
