import "../../styles/BuscarAsesoria/categoryselector.css"

export default function CategorySelector() {
  return (
    <div className="category-selector">
      <select defaultValue="category1">
        <option value="category1">Elige una categoría</option>
        <option value="category2">Idiomas</option>
        <option value="category3">Sistemas</option>
        <option value="category4">Administración</option>
      </select>
    </div>
  );
}