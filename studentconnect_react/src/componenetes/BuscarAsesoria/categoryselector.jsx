import "../../styles/BuscarAsesoria/categoryselector.css"

export default function CategorySelector({ filtroCategoria, setFiltroCategoria }) {
  const handleSelectChange = (e) => {
    setFiltroCategoria(e.target.value);
  };

  return (
    <select
      value={filtroCategoria}
      onChange={handleSelectChange}
      className="category-selector"
    >
      <option value="">Todas las categorías</option>
      <option value="Matemáticas">Matemáticas</option>
      <option value="Programación">Programación</option>
      <option value="Idiomas">Idiomas</option>
    </select>
  );
}
