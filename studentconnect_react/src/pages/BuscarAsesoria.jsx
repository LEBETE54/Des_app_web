import Navbar from "../componenetes/BuscarAsesoria/navbar";
import SearchBar from "../componenetes/BuscarAsesoria/searchbar";
import CategorySelector from "../componenetes/BuscarAsesoria/categoryselector";
import CardsGrid from "../componenetes/BuscarAsesoria/cardgrid";
import "../styles/BuscarAsesoria/BuscarAsesoria.css";

export default function BuscarAsesoria() {
  return (
    <>
      <Navbar />
      <main>
        <div className="search-container">
          <SearchBar />
          <CategorySelector />
        </div>
        <CardsGrid />
      </main>
    </>
  );
}
