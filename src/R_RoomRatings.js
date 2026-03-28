import React from 'react';
import './R_RoomRatings.css';
import logo from './logo-original.png'
import { Link } from 'react-router-dom';
const RoomRatings = () => {
    const handleLogout = () => {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    };
    return (
        <div className="rating-container">
            <aside className="sidebar">
        {/* --- START CHANGED BLOCK --- */}
        <div className="profile">
          <div className="avatar">M</div>
          <div style={{display: 'flex', flexDirection: 'column', color: '#E1BB80'}}>
            <span style={{fontWeight: 'bold', fontSize: '14px'}}>Manager</span>
            <span style={{fontSize: '12px'}}>manager@gmail.com</span>
          </div>
        </div>
        {/* --- END CHANGED BLOCK --- */}
        <nav className="menu">
          <Link to='/dashboard' className="menu-item">🏠 Dashboard</Link>
          <Link to='/roomratings' className="menu-item">⭐ Ratings</Link>
          <Link to='/amenities' className="menu-item">🏠 Amenities</Link>
          <Link to='/userdetails' className="menu-item">👤 User Details</Link>
        </nav>
        <button onClick={handleLogout} className="logout-button" style={{marginTop: '10px'}}>🚪 Logout</button>
      </aside>

            <main className="main-content">
                <h1>ROOM RATINGS</h1>
                <div className="ratings-container">
                    <div className="rating-box">
                        <span>Single Bed</span>
                        <span className="stars">★★★★☆ 4.2</span>
                    </div>
                    <div className="rating-box">
                        <span>Twin Bed</span>
                        <span className="stars">★★★★☆ 4.4</span>
                    </div>
                    <div className="rating-box">
                        <span>Double Bed</span>
                        <span className="stars">★★★★☆ 4.6</span>
                    </div>
                    <div className="rating-box">
                        <span>Four Bed Suite</span>
                        <span className="stars">★★★★★ 4.8</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RoomRatings;