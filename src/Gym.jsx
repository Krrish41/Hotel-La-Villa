import React from "react";
import "./Amenities.css";
import GymCarousel from "./imggym";
import Footer from "./footer";
const Gymming = () => {
  return (
    <>
    <div className="amenities-container">
      <GymCarousel/>
      <h2 className="amenities-title">A STATE-OF-THE-ART FITNESS CENTER</h2>
      <p className="amenities-description">
        Stay on top of your fitness goals with our advanced gym facilities, featuring cutting-edge equipment and personal training sessions.
      </p>

      <div className="amenities-section">
        <div className="amenities-text">
          <h3 className="amenities-heading">
            <hr className="highlight-divider" />
            FITNESS REDEFINED
          </h3>
          <p className="amenities-content">
            From strength training to cardio workouts, our gym is designed to cater to all fitness enthusiasts looking for a world-class experience.
          </p>
        </div>
        <div className="amenities-image-container">
          <img src={require("./g1.jpg")} alt="Gym" className="amenities-image" />
        </div>
      </div>

      <div className="amenities-highlight">
        <div className="amenities-highlight-content">
          <h2 className="amenities-highlight-title">
            <hr className="highlight-divider" />
            STRENGTH, STAMINA, SUCCESS
            <hr className="highlight-divider" />
          </h2>
          <p className="amenities-highlight-text">
            Push your limits in a premium fitness environment, designed to help you achieve peak performance and overall well-being.
          </p>
        </div>
        <div className="amenities-highlight-image">
          <img src={require("./g2.jpg")} alt="Gym Experience" className="highlight-fullwidth-img" />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Gymming;
