import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componenetes/BuscarAsesoria/navbar";
import SearchBar from "../componenetes/BuscarAsesoria/searchbar";
import CategorySelector from "../componenetes/BuscarAsesoria/categoryselector";
import CardsGrid from "../componenetes/BuscarAsesoria/cardgrid";
import "../styles/BuscarAsesoria/BuscarAsesoria.css";

export default function BuscarAsesoria() {
  const [asesorias, setAsesorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/asesorias?busqueda=${busqueda}`)
      .then((res) => {
        setAsesorias(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar asesorías:", err);
      });
  }, [busqueda]);

  const asesoriasFiltradas = asesorias.filter((asesoria) => {
    const coincideCategoria =
      filtroCategoria === "" || asesoria.categoria === filtroCategoria;
    return coincideCategoria;
  });

  return (
    <>
      <Navbar />
      <main>
        <div className="search-container">
          <SearchBar setBusqueda={setBusqueda} />
          <CategorySelector setFiltroCategoria={setFiltroCategoria} />
        </div>
        <CardsGrid asesorias={asesoriasFiltradas} />
      </main>
    </>
  );
}



