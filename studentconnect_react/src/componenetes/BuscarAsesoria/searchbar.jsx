import "../../styles/BuscarAsesoria/searchbar.css";

export default function SearchBar({ setBusqueda }) {
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className="search-bar">
      <i className="fas fa-search" />
      <input
        type="text"
        placeholder="Buscar asesoría..."
        onChange={handleInputChange}
      />
    </div>
  );
}
