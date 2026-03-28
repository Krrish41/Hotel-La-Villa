import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const images = [
  require("./img1.jpg"),
  require("./img2.jpg"),
  require("./img3.jpg"),
  require("./img4.jpg"),
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={images[currentIndex]} alt="hotel view" className="carousel-image" />
      <div className="ribbon">About Us</div>
    </div>
  );
};

export default ImageCarousel;