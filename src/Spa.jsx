import React from "react";
import "./Amenities.css";
import SpaCarousel from "./imgspa";
import Footer from "./footer";
const Spa = () => {
  return (
    <>
    <div className="amenities-container">
      <SpaCarousel/>
      <h2 className="amenities-title">A HOLISTIC SPA EXPERIENCE</h2>
      <p className="amenities-description">
        Indulge in a world of tranquility with our luxurious spa treatments, designed to relax, rejuvenate, and restore balance.
      </p>

      <div className="amenities-section">
        <div className="amenities-text">
          <h3 className="amenities-heading">
            <hr className="highlight-divider" />
            A JOURNEY OF WELLNESS
          </h3>
          <p className="amenities-content">
            Our spa offers a selection of therapeutic massages, facials, and wellness treatments, all curated for the ultimate relaxation experience.
          </p>
        </div>
        <div className="amenities-image-container">
          <img src={require("./spa1.jpg")} alt="Spa Experience" className="amenities-image" />
        </div>
      </div>

      <div className="amenities-highlight">
        <div className="amenities-highlight-content">
          <h2 className="amenities-highlight-title">
            <hr className="highlight-divider" />
            REJUVENATE YOUR SENSES
            <hr className="highlight-divider" />
          </h2>
          <p className="amenities-highlight-text">
            Escape to a realm of peace and serenity with our expert therapists, offering healing techniques inspired by ancient traditions.
          </p>
        </div>
        <div className="amenities-highlight-image">
          <img src={require("./spa2.jpg")} alt="Spa Retreat" className="highlight-fullwidth-img" />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Spa;
