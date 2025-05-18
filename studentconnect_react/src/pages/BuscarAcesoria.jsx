import Navbar from "../components/navbar";
import SearchBar from "../components/searchbar";
import CategorySelector from "../components/categoryselector";
import CardsGrid from "../components/cardsgrid";
import "../buscasesoria_style.css";

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
