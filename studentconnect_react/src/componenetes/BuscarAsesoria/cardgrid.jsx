import Card from "./card";

const data = [
  {
    titulo: "Introducción a Java",
    horario: "8:00 AM – 5:00 PM (L-V)",
    descripcion: "Traducir manuales de usuario de una televisión del español al alemán.",
    rating: "⭐⭐⭐⭐☆",
  },
  {
    titulo: "Lenguaje C y mucho más",
    horario: "8:00 AM – 12:00 PM (L-V)",
    descripcion: "Este trabajo implica reparar el tejado de una casa residencial...",
    rating: "⭐⭐⭐⭐⭐",
  },
  // …añade los demás
];

export default function CardsGrid() {
  return (
    <section className="asesorias-container">
      <h2>Programación</h2>
      <div className="cards-wrapper">
        {data.map((c) => (
          <Card key={c.titulo} {...c} />
        ))}
      </div>
    </section>
  );
}