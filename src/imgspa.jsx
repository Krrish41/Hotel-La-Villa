import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const spaImages = [
  require("./spa1.jpg"),
  require("./spa2.jpg"),
  require("./spa3.jpg"),
  require("./spa4.jpg"),
];

const SpaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % spaImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={spaImages[currentIndex]} alt="Spa Retreat" className="carousel-image" />
      <div className="carousel-text">LUXURY SPA</div>
    </div>
  );
};

export default SpaCarousel;

