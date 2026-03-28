import React from "react";
import ImageCarousel from "./ImageCarousel";
import AboutUs from "./AboutUs";
import Footer from "./footer";
import "./AboutUsMain.css";

function AboutUsMain() {
  return (
    <div>
      <ImageCarousel />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default AboutUsMain;