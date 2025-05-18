export default function Card({ titulo, horario, descripcion, rating }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>
      <span className="label">Por periodo</span>
      <p className="horario">{horario}</p>
      <p className="descripcion">{descripcion}</p>
      <div className="rating">{rating}</div>
    </div>
  );
}