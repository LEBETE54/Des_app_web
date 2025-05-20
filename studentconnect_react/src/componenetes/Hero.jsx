import mainImg from "../assets/imagenes/image.png";
import "../styles/hero.css";

export default function Hero() {
  return (
    <div className="main1">
      <div className="desc">
        <h1>¡Que tu mejor amigo sea tu asesor!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem adipisci
          quod earum voluptates...
        </p>
        <a className="action_btn Registrarse" href="/signupalumnos">Comenzar Ahora</a>
      </div>
      <div className="img">
        <img className="main_img" src={mainImg} alt="personas" />
      </div>
    </div>
  );
}
