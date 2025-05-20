import Navbarhome from "../componenetes/Home/NavBarHome.jsx";
import DropdownMenu from "../componenetes/Home/DropdownMenu.jsx";
import Hero from "../componenetes/Home/Hero.jsx";
import "../styles/Home/home.css";

export default function Home() {
  return (
    <>
      <Navbarhome />
      <DropdownMenu />
      <main>
        <Hero />
        <div className="main2"></div>
      </main>
    </>
  );
}
