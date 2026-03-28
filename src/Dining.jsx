import React from "react";
import "./Amenities.css";
import DiningCarousel from "./imgdining";
import Footer from "./footer";

const Dining = () => {
  return (
    <>
    <div className="amenities-container">
      <DiningCarousel/>
      <h2 className="amenities-title">A CULINARY EXPERIENCE LIKE NO OTHER</h2>
      <p className="amenities-description">
        Indulge in a symphony of flavors at Hotel La Villa, where world-class chefs craft exquisite culinary delights.
      </p>

      <div className="amenities-section">
        <div className="amenities-text">
          <h3 className="amenities-heading">
            <hr className="highlight-divider" />
            FINE DINING REDEFINED
          </h3>
          <p className="amenities-content">
            Our award-winning restaurants offer a diverse range of gourmet experiences, from authentic local delicacies to international favorites.
          </p>
        </div>
        <div className="amenities-image-container">
          <img src={require("./dining1.jpg")} alt="Fine Dining" className="amenities-image" />
        </div>
      </div>

      <div className="amenities-highlight">
        <div className="amenities-highlight-content">
          <h2 className="amenities-highlight-title">
            <hr className="highlight-divider" />
            EXQUISITE TASTES, UNFORGETTABLE MOMENTS
            <hr className="highlight-divider" />
          </h2>
          <p className="amenities-highlight-text">
            From elegant afternoon teas to lavish buffets, our dining experiences are designed to elevate every moment.
          </p>
        </div>
        <div className="amenities-highlight-image">
          <img src={require("./dining2.jpg")} alt="Dining Experience" className="highlight-fullwidth-img" />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Dining;
