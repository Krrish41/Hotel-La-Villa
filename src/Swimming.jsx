import React from "react";
import "./Amenities.css";
import SwimmingCarousel from "./imgswimming";
import Footer from "./footer";

const Swimming = () => {
  return (
    <>
    <div className="amenities-container">
      <SwimmingCarousel/>
      <h2 className="amenities-title">A SERENE SWIMMING EXPERIENCE</h2>
      <p className="amenities-description">
        Immerse yourself in the crystal-clear waters of our luxurious swimming pool, designed for relaxation and rejuvenation.
      </p>

      <div className="amenities-section">
        <div className="amenities-text">
          <h3 className="amenities-heading">
            <hr className="highlight-divider" />
            SWIM IN LUXURY
          </h3>
          <p className="amenities-content">
            Whether you're taking a refreshing dip or lounging by the poolside with a cocktail, our swimming facilities offer an oasis of tranquility.
          </p>
        </div>
        <div className="amenities-image-container">
          <img src={require("./s1.jpg")} alt="Swimming Pool" className="amenities-image" />
        </div>
      </div>

      <div className="amenities-highlight">
        <div className="amenities-highlight-content">
          <h2 className="amenities-highlight-title">
            <hr className="highlight-divider" />
            DIVE INTO RELAXATION
            <hr className="highlight-divider" />
          </h2>
          <p className="amenities-highlight-text">
            Experience the perfect blend of luxury and serenity in our temperature-controlled pools, offering an escape from the everyday hustle.
          </p>
        </div>
        <div className="amenities-highlight-image">
          <img src={require("./s2.jpg")} alt="Swimming Pool Experience" className="highlight-fullwidth-img" />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Swimming;
