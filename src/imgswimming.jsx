import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const swimmingImages = [
  require("./s1.jpg"),
  require("./s2.jpg"),
  require("./s3.jpg"),
  require("./s4.jpg"),
];

const SwimmingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % swimmingImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={swimmingImages[currentIndex]} alt="Swimming Pool" className="carousel-image" />
      <div className="carousel-text">SWIMMING POOL</div>
    </div>
  );
};

export default SwimmingCarousel;
