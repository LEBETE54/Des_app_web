import "../../styles/Recursos/recursoitem.css"
export default function RecursoItem({ imgSrc, title, description, type, date, link, isDownload }) {
  return (
    <div className="recurso">
      <img src={imgSrc} alt={title} />
      <div className="info-recurso">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="tipo">{type}</span>
        <div className="fecha">Publicado el {date}</div>
      </div>
      <a
        href={link}
        className="boton-recurso"
        target={isDownload ? "_self" : "_blank"}
        rel="noopener noreferrer"
        download={isDownload}
      >
        {isDownload ? "Descargar" : "Ir"}
      </a>
    </div>
  );
}
