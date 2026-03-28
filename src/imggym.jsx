import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const gymImages = [
  require("./g1.jpg"),
  require("./g2.jpg"),
  require("./g3.jpg"),
  require("./g4.jpg"),
];

const GymCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gymImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={gymImages[currentIndex]} alt="Gym Facility" className="carousel-image" />
      <div className="carousel-text">GYM & FITNESS</div>
    </div>
  );
};

export default GymCarousel;
