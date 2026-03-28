import React, { useEffect, useState } from 'react';
import './R_Admin.css';
import img1 from './logo-original.png'
import { Link, useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

const Admin = () => {
  const navigate = useNavigate(); // <-- 2. Initialize navigate
  const [stats, setStats] = useState({
    weekly: { totalSales: 0, amenitiesSales: 0, roomSales: 0 },
    availability: { roomsAvailable: 100, staffAvailable: 200, byType: {} }
  });
  const [bookings, setBookings] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRows, setFeedbackRows] = useState([]);

  useEffect(() => {
    // Load Google Charts
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(drawCharts);
      } else {
        const script = document.createElement('script');
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.onload = () => {
          window.google.charts.load("current", { packages: ["corechart"] });
          window.google.charts.setOnLoadCallback(drawCharts);
        };
        document.body.appendChild(script);
      }
    };

    const drawCharts = () => {
      if (!window.google || !window.google.visualization) {
        setTimeout(drawCharts, 100);
        return;
      }

      const byType = stats.availability.byType || {};
      const single = byType['Single Bed'] ?? 50;
      const twin = byType['Twin Bed'] ?? 20;
      const dbl = byType['Double Bed'] ?? 20;
      const four = byType['Four Bed Suite'] ?? 10;

      const graphBox1 = document.getElementById('graph-box-1');
      if (graphBox1) {
        // Clear previous chart completely
        graphBox1.innerHTML = '';
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const data1 = window.google.visualization.arrayToDataTable([
            ['Types of room', 'Number of rooms available'],
            ['Single bed', single],
            ['Twin bed', twin],
            ['Double bed', dbl],
            ['Four bed suite', four],
          ]);

          const options1 = {
            title: 'Rooms Available',
            pieHole: 0.4,
            backgroundColor: '#FFF8E1',
          };

          try {
            const chart1 = new window.google.visualization.PieChart(graphBox1);
            chart1.draw(data1, options1);
          } catch (err) {
            console.error('Error drawing chart:', err);
          }
        }, 50);
      }

      const graphBox2 = document.getElementById('graph-box-2');
      if (graphBox2) {
        const data2 = window.google.visualization.arrayToDataTable([
          ['Types of room', 'Rating'],
          ['Single bed', 4.2],
          ['Twin bed', 4.4],
          ['Double bed', 4.6],
          ['Four bed suite', 4.8]
        ]);

        const options2 = {
          title: 'Room Ratings',
          curveType: 'function',
          legend: { position: 'bottom' },
          backgroundColor: '#FFF8E1',
          vAxis: { viewWindow: { min: 0, max: 5 } }
        };

        const chart2 = new window.google.visualization.LineChart(graphBox2);
        chart2.draw(data2, options2);
      }
    };

    loadGoogleCharts();
  }, [stats]);

  useEffect(() => {
    // Fetch protected stats and bookings immediately on mount
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.warn('No admin token found');
        return;
      }
      
      const timestamp = Date.now();
      try {
        const [s, b, f] = await Promise.all([
          fetch(`http://localhost:5000/api/admin/stats?_=${timestamp}`, { 
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            } 
          }),
          fetch(`http://localhost:5000/api/admin/bookings?_=${timestamp}`, { 
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            } 
          }),
          fetch(`http://localhost:5000/api/admin/feedback?_=${timestamp}`, { 
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            } 
          })
        ]);
        
        if (s.ok) {
          const data = await s.json();
          console.log('Stats received:', data);
          console.log('Rooms available:', data.availability?.roomsAvailable);
          console.log('Staff available:', data.availability?.staffAvailable);
          setStats(data);
        } else {
          const errorText = await s.text();
          console.error('Stats fetch failed:', s.status, errorText);
        }
        
        if (b.ok) {
          const rows = await b.json();
          setBookings(rows);
        }
        
        if (f.ok) {
          const fb = await f.json();
          setFeedbackRows(fb);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    // Fetch immediately on mount/login
    fetchStats();
    
    // Then refresh every 5 seconds to keep data updated
    const id = setInterval(fetchStats, 5000);
    return () => clearInterval(id);
  }, []);

  const openGoogleSheets = () => {
    window.location.href = 'https://docs.google.com/spreadsheets/d/1EBM1JruSYMpnI-z-7ljea1pEpIdlh2Afq45Le1FgftA/edit?gid=0#gid=0';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const scrollToOverview = () => {
    const target = document.querySelector('.stats');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const staffedAssignments = bookings.map((b) => ({
    room: b.room_type,
    period: `${b.check_in_date} → ${b.check_out_date}`,
    staffAllocated: 2
  }));

  return (
    <div className='admin-body'>
    <div className="radmin-container">
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
        <div className="banner">
          <span>A Great Place to Stay, Even Better Place to Work</span>
          <div className="top-boxes">
            <div className="top-box" onClick={() => setShowHistory(true)}>Room History</div>
            <div className="top-box" onClick={() => setShowStaff(true)}>Staff Details</div>
            <div className="top-box" onClick={() => setShowFeedback(true)}>Feedback</div>
          </div>
        </div>
        <div className="title">
          <h1>DASHBOARD</h1>
        </div>
        <div className="stats">
          <div className="card">
            <h2>Weekly Sales</h2>
            <p className="value">₹{stats.weekly?.totalSales?.toLocaleString?.() || 0}</p>
          </div>
          <div className="card">
            <h2>Available Staff</h2>
            <p className="value">{stats.availability?.staffAvailable ?? 200}</p>
          </div>
          <div className="card">
            <h2>Rooms Available</h2>
            <p className="value">{stats.availability?.roomsAvailable ?? 100}</p>
          </div>
        </div>
        <div className="graphs-section">
          <h2>GRAPHS</h2>
          <div className="graphs-container">
            <div className="graph-box" id="graph-box-1"></div>
            <div className="graph-box" id="graph-box-2"></div>
          </div>
        </div>
      </main>
    </div>

    {/* Room History Modal */}
    {showHistory && (
      <div className="modal-backdrop" onClick={() => setShowHistory(false)}>
        <div className="modal wide" onClick={(e)=>e.stopPropagation()}>
          <h3>Room History</h3>
          <div style={{padding: '20px', margin: '20px 0'}}>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.room_type}</td>
                    <td>{b.check_in_date}</td>
                    <td>{b.check_out_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding: '20px', margin: '20px 0'}}>
            <h4>Available Rooms (Current)</h4>
            <ul>
              <li>Single Bed: {stats.availability.byType?.['Single Bed'] ?? 50}</li>
              <li>Twin Bed: {stats.availability.byType?.['Twin Bed'] ?? 20}</li>
              <li>Double Bed: {stats.availability.byType?.['Double Bed'] ?? 20}</li>
              <li>Four Bed Suite: {stats.availability.byType?.['Four Bed Suite'] ?? 10}</li>
            </ul>
          </div>
          <button onClick={() => setShowHistory(false)}>Close</button>
        </div>
      </div>
    )}

    {/* Staff Details Modal */}
    {showStaff && (
      <div className="modal-backdrop" onClick={() => setShowStaff(false)}>
        <div className="modal wide" onClick={(e)=>e.stopPropagation()}>
          <h3>Staff Details</h3>
          <div style={{padding: '20px', margin: '20px 0'}}>
            <p>Total Staff Available: {stats.availability.staffAvailable}</p>
          </div>
          <div style={{padding: '20px', margin: '20px 0'}}>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Period</th>
                  <th>Staff Allocated</th>
                </tr>
              </thead>
              <tbody>
                {staffedAssignments.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.room}</td>
                    <td>{s.period}</td>
                    <td>{s.staffAllocated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setShowStaff(false)}>Close</button>
        </div>
      </div>
    )}

    {showFeedback && (
      <div className="modal-backdrop" onClick={() => setShowFeedback(false)}>
        <div className="modal wide" onClick={(e)=>e.stopPropagation()}>
          <h3>Feedback</h3>
          <div style={{padding: '20px', margin: '20px 0'}}>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Amenities</th>
                  <th>Hospitality</th>
                  <th>Comments</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {feedbackRows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.amenities_rating}</td>
                    <td>{r.hospitality_rating}</td>
                    <td>{r.comments}</td>
                    <td>{r.submitted_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setShowFeedback(false)}>Close</button>
        </div>
      </div>
    )}
    </div>
  );
};

export default Admin;
