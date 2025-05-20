import RecursoItem from "./RecursoItem.jsx";
import "../../styles/Recursos/recursos.css";

export default function RecursosGrid() {
  return (
    <div className="container">
      <div className="titulo">Recursos Disponibles</div>

      <RecursoItem
        imgSrc="https://cdn-icons-png.flaticon.com/512/337/337946.png"
        title="Guía de Introducción a C++"
        description="Un PDF con conceptos básicos y ejercicios para comenzar."
        type="Archivo PDF"
        date="05/04/2024"
        link="#"
        isDownload={true}
      />

      <RecursoItem
        imgSrc="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
        title="Tutorial de Punteros en C++"
        description="Video explicativo en YouTube sobre punteros."
        type="Video"
        date="09/04/2024"
        link="https://www.youtube.com/"
        isDownload={false}
      />

      <RecursoItem
        imgSrc="https://cdn-icons-png.flaticon.com/512/3022/3022258.png"
        title="Documentación Oficial C++"
        description="Referencia completa del lenguaje en el sitio oficial."
        type="Enlace web"
        date="01/03/2024"
        link="https://cplusplus.com/"
        isDownload={false}
      />
    </div>
  );
}
