import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Portfolio } from "./components/Portfolio";
import { Team } from "./components/Team";
import { Certifications } from "./components/Certifications";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Certifications />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
