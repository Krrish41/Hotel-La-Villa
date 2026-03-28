import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const diningImages = [
  require("./d1.jpg"),
  require("./d2.jpg"),
  require("./d3.jpg"),
  require("./d4.jpg"),
];

const DiningCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % diningImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={diningImages[currentIndex]} alt="Dining Experience" className="carousel-image" />
      <div className="carousel-text">FINE DINING</div>
    </div>
  );
};

export default DiningCarousel;
