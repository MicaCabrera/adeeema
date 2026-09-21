import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Institutional from "./components/Institutional";
import Network from "./components/Network";
import MissionVision from "./components/MissionVision";
import Academy from "./components/Academy";
import Media from "./components/Media";
import Fan from "./components/Fan";
import News from "./components/News";
import NewsDetail from "./components/NewsDetail";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Institutional />
      <Network />
      <MissionVision />
      <Academy />
      <Media />
      <Fan />
      <News />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <ScrollManager />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/actualidad/:slug" element={<NewsDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
