import React from "react";
import "./aboutus.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">THE UNPARALLELED GUARDIAN OF GRANDEUR</h2>
      <p className="about-description">
        Built on a vision of grandeur, Hotel La Villa conjures a panoply of
        superlative experiences that indulge and forge unforgettable memories.
      </p>

      <div className="monumental-vision">
        <div className="monumental-text">
          <h3 className="monumental-heading">
            <hr className="monumental-divider" />
             A   MONUMENTAL   VISION
          </h3>
          <p className="monumental-content">
            In December 1903, a visionary realized his dream. Our founder
            opened the doors of what would become one of the world’s greatest
            hotels, redefining luxury and excellence in hospitality.
          </p>
        </div>
        <div className="monumental-image-container">
          <img
            src={require("./img1.jpg")}
            alt="Hotel Founder"
            className="monumental-image"
          />
        </div>
      </div>

      <div className="global-legend">
        <div className="global-legend-content">
          <h2 className="global-legend-title">
            <hr className="legend-divider" />
            A GLOBAL LEGEND
            <hr className="legend-divider" />
          </h2>
          <p className="global-legend-text">
            Hotel La Villa is more than just a place to stay—it is a symbol of
            heritage, culture, and world-class service. From regal suites to
            bespoke experiences, each property under our banner embodies a
            unique blend of timeless elegance and modern indulgence.
          </p>
        </div>
        <div className="global-legend-image">
          <img
            src={require("./hero.jpg")}
            alt="Hotel Legacy"
            className="legend-fullwidth-img"
          />
        </div>
      </div>

      <div className="hospitality-section">
        <div className="video-background">
          <video
            className="video"
            src="https://assets-cug1-825v2.tajhotels.com/video/TAJ%20WEBSITE%20FILM_1920%20X%20930_148mb.mp4?Impolicy=Medium_High"
            title="Hotel Tour"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </div>
        <div className="hospitality-content">
          <h3 className="hospitality-heading">
            <hr className="hospitality-divider" />
            A FEELING CALLED ‘HOSPITALITY’
          </h3>
          <p className="hospitality-text">
            Crafting individual experiences is an art at Hotel La Villa. Regal,
            memorable, and tailored to your every whim, our hospitality is an
            experience meant to be cherished forever.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;