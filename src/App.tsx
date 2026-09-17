import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Institutional from "./components/Institutional";
import Network from "./components/Network";
import MissionVision from "./components/MissionVision";
import Academy from "./components/Academy";
import Media from "./components/Media";
import Fan from "./components/Fan";
import News from "./components/News";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Hero />
        <Institutional />
        <Network />
        <MissionVision />
        <Academy />
        <Media />
        <Fan />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
