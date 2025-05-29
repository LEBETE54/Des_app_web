import Navbar from "../components/Home/NavBarHome.jsx";
import DropdownMenu from "../components/Home/DropdownMenu.jsx";
import Hero from "../components/Home/Hero.jsx";
import "../styles/Home/home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <DropdownMenu />
      <main>
        <Hero />
        <div className="main2"></div>
      </main>
    </>
  );
}
