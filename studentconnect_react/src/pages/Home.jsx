import Navbarhome from "../componenetes/NavBarHome";
import DropdownMenu from "../componenetes/DropdownMenu.jsx";
import Hero from "../componenetes/Hero.jsx";
import "../styles/home.css";

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
