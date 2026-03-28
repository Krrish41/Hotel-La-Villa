import React, { useEffect, useState } from 'react';
import './R_Amenities.css'; // Assuming you will create a separate CSS file for styles
import logo from './logo-original.png'
import { Link } from 'react-router-dom';
const Amenities = () => {
    const handleLogout = () => {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    };
    const [stats, setStats] = useState({ total: 0, breakdown: { Spa: 0, Gym: 0, Breakfast: 0, 'Airport Transfer': 0 } });
    const [modalAmenity, setModalAmenity] = useState(null);
    const [showLearnMore, setShowLearnMore] = useState(false);
    const [amenityBookings, setAmenityBookings] = useState([]);

    const amenitiesData = [
        {
            name: "Breakfast",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
            earnings: "₹2 lakhs",
            statisticsLink: "#"
        },
        {
            name: "Gym",
            image: "https://i.pinimg.com/736x/69/9b/36/699b36fe751f7a7fd00390d9d9330549.jpg",
            earnings: "₹2 lakhs",
            statisticsLink: "#"
        },
        {
            name: "Spa",
            image: "https://i.pinimg.com/474x/52/3d/2a/523d2a42bd0ab69666715c2dae272c3a.jpg",
            earnings: "₹2 lakhs",
            statisticsLink: "#"
        },
        {
            name: "Airport Transfer",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            earnings: "₹2 lakhs",
            statisticsLink: "#"
        }
    ];

    useEffect(() => {
      const fetchStats = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.warn('No admin token found for amenities');
          return;
        }
        
        const timestamp = Date.now();
        try {
          const resp = await fetch(`http://localhost:5000/api/admin/amenities/stats?_=${timestamp}`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (resp.ok) {
            const data = await resp.json();
            console.log('Amenities stats received:', data);
            setStats(data);
          } else {
            console.error('Amenities stats fetch failed:', resp.status);
          }
        } catch (error) {
          console.error('Error fetching amenities stats:', error);
        }
      };
      
      // Fetch immediately on mount/navigation
      fetchStats();
      
      // Refresh every 5 seconds
      const id = setInterval(fetchStats, 5000);
      return () => clearInterval(id);
    }, []);

    useEffect(() => {
      if (!modalAmenity) {
        setAmenityBookings([]);
        return;
      }
      const fetchBookings = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No admin token found');
          return;
        }
        try {
          // Clear existing bookings first to ensure fresh data
          setAmenityBookings([]);
          const resp = await fetch(`http://localhost:5000/api/admin/amenities/bookings?amenity=${encodeURIComponent(modalAmenity)}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          });
          if (resp.ok) {
            const data = await resp.json();
            console.log('Amenity bookings data:', data);
            setAmenityBookings(Array.isArray(data) ? data : []);
          } else {
            const errorData = await resp.json().catch(() => ({}));
            console.error('Failed to fetch bookings:', errorData);
            setAmenityBookings([]);
          }
        } catch (e) {
          console.error('Error fetching amenity bookings:', e);
          setAmenityBookings([]);
        }
      };
      fetchBookings();
    }, [modalAmenity]);

    return (
        <div className="container-am">
            {/* Sidebar Section */}
            <aside className="sidebar">
        <div className="profile">
          <div className="avatar">M</div>
          <div style={{display: 'flex', flexDirection: 'column', color: '#E1BB80'}}>
            <span style={{fontWeight: 'bold', fontSize: '14px'}}>Manager</span>
            <span style={{fontSize: '12px'}}>manager@gmail.com</span>
          </div>
        </div>
        <nav className="menu">
          <Link to='/dashboard' className="menu-item">🏠 Dashboard</Link>
          <Link to='/roomratings' className="menu-item">⭐ Ratings</Link>
          <Link to='/amenities' className="menu-item">🏠 Amenities</Link>
          <Link to='/userdetails' className="menu-item">👤 User Details</Link>
        </nav>
        <button onClick={handleLogout} className="logout-button" style={{marginTop: '10px'}}>🚪 Logout</button>
      </aside>

            {/* Main Content Section */}
            <main className="main-content">
                <div className="title">Amenities</div>
                <div className="total-earning">
                    Total Earnings (All Time): ₹{ (stats.total||0).toLocaleString() } (<button className="learn-more" onClick={() => setShowLearnMore(true)}>Learn More</button>)
                </div>

                {/* Amenities Boxes Section */}
                <div className="amenitie-container">
                    {amenitiesData.map((amenity, index) => (
                        <div 
                            key={index} 
                            className="amenity-box" 
                            style={{ backgroundImage: `url(${amenity.image})` }}
                            onMouseEnter={() => {}}
                            title={`Hover to see totals. Click to view statistics.`}
                        >
                            {amenity.name}
                            <div className="earnings-overlay">
                                Total Earning: ₹{ (stats.breakdown[amenity.name] || 0).toLocaleString() } <br />
                                <button className="view-statistics" onClick={(e) => { e.stopPropagation(); setModalAmenity(amenity.name); }}>View Statistics</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Modal for statistics */}
            {modalAmenity && (
              <div className="modal-backdrop" onClick={() => setModalAmenity(null)}>
                <div className="modal wide" onClick={(e) => e.stopPropagation()}>
                  <h3>{modalAmenity} - Booking Details</h3>
                  <div style={{padding: '20px', margin: '20px 0'}}>
                    <p><strong>Total Earnings: ₹{ (stats.breakdown[modalAmenity] || 0).toLocaleString() }</strong></p>
                    <p>Total Bookings: {amenityBookings.length}</p>
                    <table className="bookings-table" style={{marginTop: '12px'}}>
                        <thead>
                          <tr>
                            <th>Booking Date</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Customer</th>
                            <th>Cost per Booking</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amenityBookings.length > 0 ? (
                            amenityBookings.map((b, idx) => (
                              <tr key={idx}>
                                <td style={{color: '#1a1a1a'}}>{b.booking_date || b.check_in_date || 'N/A'}</td>
                                <td style={{color: '#1a1a1a'}}>{b.check_in_date || 'N/A'}</td>
                                <td style={{color: '#1a1a1a'}}>{b.check_out_date || 'N/A'}</td>
                                <td style={{color: '#1a1a1a'}}>{b.customer_name || 'N/A'}</td>
                                <td style={{color: '#1a1a1a'}}>₹{Number(b.amenity_cost || 0).toLocaleString()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" style={{textAlign: 'center', color: '#1a1a1a'}}>No bookings found for this amenity</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setModalAmenity(null)}>Close</button>
                </div>
              </div>
            )}

            {/* Learn More Modal */}
            {showLearnMore && (
              <div className="modal-backdrop" onClick={() => setShowLearnMore(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h3>Amenities Total Earnings</h3>
                  <p style={{marginBottom: '15px', color: '#1a1a1a'}}>Individual earnings breakdown:</p>
                  <ul>
                    <li>Spa: ₹{ (stats.breakdown['Spa']||0).toLocaleString() }</li>
                    <li>Gym: ₹{ (stats.breakdown['Gym']||0).toLocaleString() }</li>
                    <li>Breakfast: ₹{ (stats.breakdown['Breakfast']||0).toLocaleString() }</li>
                    <li>Airport Transfer: ₹{ (stats.breakdown['Airport Transfer']||0).toLocaleString() }</li>
                  </ul>
                  <strong style={{display: 'block', marginTop: '15px', fontSize: '18px'}}>Total Earnings: ₹{ (stats.total||0).toLocaleString() }</strong>
                  <button onClick={() => setShowLearnMore(false)}>Close</button>
                </div>
              </div>
            )}
        </div>
    );
};

export default Amenities;