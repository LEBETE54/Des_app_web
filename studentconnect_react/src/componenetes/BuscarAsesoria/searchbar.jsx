import "../../styles/BuscarAsesoria/searchbar.css";

export default function SearchBar() {
  return (
    <div className="search-bar">
      <i className="fas fa-search" />
      <input type="text" placeholder="Buscar proyectos..." />
    </div>
  );
}