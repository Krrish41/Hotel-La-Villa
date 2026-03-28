import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
       
        <div className="footer-subscribe">
          <h3 className="footer-heading">SUBSCRIBE FOR LATEST UPDATES</h3>
          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email address" />
          </div>
          <br />
          <button>SUBSCRIBE</button>
        </div>

    
        <div className="footer-contact">
          <h3 className="footer-heading">FOR BOOKINGS CONTACT</h3>
          <p>
            <a href="tel:1-800-111-825">1-800-111-825</a>
          </p>
          <p>
            <a href="mailto:reservations@lavillahotels.com">
              reservations@lavillahotels.com
            </a>
          </p>

          <h3 className="footer-heading">CUSTOMER SUPPORT</h3>
          <p>
            <a href="mailto:support@lavillahotels.com">
              support@lavillahotels.com
            </a>
          </p>
          <p>
            <a href="mailto:feedback@lavillahotels.com">
              feedback@lavillahotels.com
            </a>
          </p>
        </div>

        
        <div className="footer-links">
          <h3 className="footer-heading">QUICK LINKS</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/dining">Dining</Link></li>
            <li><Link to="/spa">Spa</Link></li>
            <li><Link to="/swimming">Swimming</Link></li>
            <li><Link to="/gym">Gym</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/dashboard">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>© 2025 La Villa Hotels. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;