import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componenetes/BuscarAsesoria/navbar";
import SearchBar from "../componenetes/BuscarAsesoria/searchbar";
import CategorySelector from "../componenetes/BuscarAsesoria/categoryselector";
import "../styles/BuscarAsesoria/BuscarAsesoria.css";

// CardsGrid ahora recibe las asesorías como props
import CardsGrid from "../componenetes/BuscarAsesoria/cardgrid";

export default function BuscarAsesoria() {
  const [asesorias, setAsesorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Cargar asesorías desde el backend
  useEffect(() => {
    axios.get("http://localhost:3001/api/asesorias")
      .then((res) => {
        setAsesorias(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar asesorías:", err);
      });
  }, []);

  // Lógica para filtrar las asesorías según búsqueda y categoría
  const asesoriasFiltradas = asesorias.filter((asesoria) => {
    const coincideBusqueda = asesoria.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "" || asesoria.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <>
      <Navbar />
      <main>
        <div className="search-container">
          {/* SearchBar debe permitir actualizar la búsqueda */}
          <SearchBar setBusqueda={setBusqueda} />
          {/* CategorySelector debe permitir cambiar la categoría */}
          <CategorySelector setFiltroCategoria={setFiltroCategoria} />
        </div>
        {/* Mostrar solo las asesorías filtradas */}
        <CardsGrid asesorias={asesoriasFiltradas} />
      </main>
    </>
  );
}


