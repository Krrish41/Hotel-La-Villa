import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import logo from "./logo-original.png";
import Footer from "./footer";

const AdminLogin = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [showTerms, setShowTerms] = useState(false);
const [showPrivacy, setShowPrivacy] = useState(false);
const navigate = useNavigate();

const handleLogin = async (e) => {
e.preventDefault();
setError(""); // reset any old error

try {
  const response = await fetch("http://localhost:5000/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.success) {
    localStorage.setItem("adminToken", data.token);
    navigate("/dashboard");
  } else {
    setError(data.message || "Invalid Credentials");
  }
} catch (err) {
  console.error("Error:", err);
  setError("Something went wrong. Try again.");
}
};

return (
<> <div className="admin-container"> <div className="login-container"> <div className="login-box"> <div className="left-section"> <img src={logo} alt="Hotel La Villa Logo" /> </div>


        <div className="right-section">
          <h1>HOTEL LA VILLA</h1>
          <p>Login as a Manager</p>

          {error && (
            <div className="error-box fade-in">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>

          <p className="terms">
            <button type="button" className="linklike" onClick={() => setShowTerms(true)}>Terms of Use</button>
            <span style={{margin: '0 8px'}}>|</span>
            <button type="button" className="linklike" onClick={() => setShowPrivacy(true)}>Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Terms Modal */}
  {showTerms && (
    <div className="modal-backdrop" onClick={() => setShowTerms(false)}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3>Terms of Use</h3>
        <p>By accessing the admin portal, you agree to comply with all security policies and confidentiality terms. Use is restricted to authorized personnel only.</p>
        <button onClick={() => setShowTerms(false)}>Close</button>
      </div>
    </div>
  )}

  {/* Privacy Modal */}
  {showPrivacy && (
    <div className="modal-backdrop" onClick={() => setShowPrivacy(false)}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3>Privacy Policy</h3>
        <p>We process personal data solely to manage reservations and operations. Data is stored securely and retained per regulatory requirements.</p>
        <button onClick={() => setShowPrivacy(false)}>Close</button>
      </div>
    </div>
  )}
  <Footer />
</>


);
};

export default AdminLogin;
