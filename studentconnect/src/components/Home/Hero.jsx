import mainImg from "../../assets/image.png";
import "../../styles/Home/hero.css";

export default function Hero() {
  return (
    <div className="main1">
      <div className="desc">
        <h1>¡Que tu mejor amigo sea tu asesor!</h1>
        <p>
          Las mejores asesorias comienzan aqui
        </p>
        <a className="action_btn Registrarse" href="/signup">Comenzar Ahora</a>
      </div>
      <div className="img">
        <img className="main_img" src={mainImg} alt="personas" />
      </div>
    </div>
  );
}
