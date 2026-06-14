import About from "@/components/layout/AboutSection";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import Navbar from "@/components/layout/Navbar";
import Testimonials from "@/components/layout/Testimonials";
import React from "react";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <About />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;
