import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img1 from './logo-original.png'
import "./UserDetailTab.css";

const UserDetailTab = () => {
  const [filters, setFilters] = useState({ name: '', email: '', phone: '', roomType: '', checkIn: '', checkOut: '' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const amenitiesList = ["Spa","Gym", "Breakfast", "Airport Transfer"];
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k,v]) => { if (v) params.set(k, v); });
      const resp = await fetch(`http://localhost:5000/api/admin/bookings?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ name: '', email: '', phone: '', roomType: '', checkIn: '', checkOut: '' });
    // Automatically fetch all bookings after reset
    setTimeout(() => {
      fetchBookings();
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  const startEdit = (row) => {
    setEditRow(row.id);
    setEditForm({
      customer_name: row.customer_name,
      customer_email: row.customer_email,
      customer_phone: row.customer_phone,
      room_type: row.room_type,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
      total_price: row.total_price,
      amenities: Array.isArray(row.amenities) ? row.amenities : []
    });
  };

  const cancelEdit = () => {
    setEditRow(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const updateData = {
        customer_name: editForm.customer_name,
        customer_email: editForm.customer_email,
        customer_phone: editForm.customer_phone,
        room_type: editForm.room_type,
        check_in_date: editForm.check_in_date,
        check_out_date: editForm.check_out_date,
        total_price: Number(editForm.total_price),
        amenities: editForm.amenities
      };
      const resp = await fetch(`http://localhost:5000/api/admin/bookings/${editRow}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      const data = await resp.json();
      if (resp.ok) {
        await fetchBookings();
        cancelEdit();
      } else {
        alert(`Failed to save: ${data.message || 'Unknown error'}`);
      }
    } catch (e) {
      alert(`Failed to save: ${e.message}`);
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const resp = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        await fetchBookings();
      } else {
        alert(`Failed to delete: ${data.message || 'Unknown error'}`);
      }
    } catch (e) {
      alert(`Failed to delete: ${e.message}`);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Room Type', 'Check In', 'Check Out', 'Total Price'];
    const rows = bookings.map(b => [
      b.id, b.customer_name, b.customer_email, b.customer_phone, 
      b.room_type, b.check_in_date, b.check_out_date, b.total_price
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="main-bod">
    <aside className="sidebar" style={{height:'110vh'}}>
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
    <div className="user-container">
      <div style={{width: '100%', marginBottom: '12px', position: 'relative'}}>
        <h1 style={{margin: 0, textAlign: 'center'}}>All Bookings</h1>
        <button onClick={exportCSV} className="export-csv-btn" style={{position: 'absolute', top: 0, right: 0}}>Export CSV</button>
      </div>
      <div className="search-bar">
        <div className="search-row">
          <div className="search-field">
            <label>Name</label>
            <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
          </div>
          <div className="search-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
          </div>
          <div className="search-field">
            <label>Phone</label>
            <input type="text" name="phone" placeholder="Phone" value={filters.phone} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="search-row">
          <div className="search-field">
            <label>Room Type</label>
            <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">All Rooms</option>
              <option value="Single Bed">Single bed room</option>
              <option value="Twin Bed">Twin bed room</option>
              <option value="Double Bed">Double bed room</option>
              <option value="Four Bed Suite">Four Bed Suite</option>
            </select>
          </div>
          <div className="search-field">
            <label>Check In</label>
            <input type="date" name="checkIn" value={filters.checkIn} onChange={handleFilterChange} />
          </div>
          <div className="search-field">
            <label>Check Out</label>
            <input type="date" name="checkOut" value={filters.checkOut} onChange={handleFilterChange} />
          </div>
          <div className="search-buttons">
            <button onClick={fetchBookings} disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
            <button className="reset-btn" type="button" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Room Type</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                {editRow === b.id ? (
                  <>
                    <td><input name="customer_name" value={editForm.customer_name} onChange={handleEditChange} /></td>
                    <td><input name="customer_email" value={editForm.customer_email} onChange={handleEditChange} /></td>
                    <td><input name="customer_phone" value={editForm.customer_phone} onChange={handleEditChange} /></td>
                    <td>
                      <select name="room_type" value={editForm.room_type} onChange={handleEditChange}>
                        <option>Single Bed</option>
                        <option>Twin Bed</option>
                        <option>Double Bed</option>
                        <option>Four Bed Suite</option>
                      </select>
                    </td>
                    <td><input type="date" name="check_in_date" value={editForm.check_in_date} onChange={handleEditChange} /></td>
                    <td><input type="date" name="check_out_date" value={editForm.check_out_date} onChange={handleEditChange} /></td>
                    <td><input name="total_price" value={editForm.total_price} onChange={handleEditChange} /></td>
                    <td style={{display: 'flex', gap: '8px'}}>
                      <button onClick={saveEdit}>Save</button>
                      <button className="reset-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{b.customer_name}</td>
                    <td>{b.customer_email}</td>
                    <td>{b.customer_phone}</td>
                    <td>{b.room_type}</td>
                    <td>{b.check_in_date}</td>
                    <td>{b.check_out_date}</td>
                    <td>{Number(b.total_price).toLocaleString()}</td>
                    <td style={{display: 'flex', gap: '8px'}}>
                      <button onClick={() => startEdit(b)}>Edit</button>
                      <button className="reset-btn" onClick={() => deleteRow(b.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {(!bookings || bookings.length === 0) && (
              <tr><td colSpan="7" style={{textAlign:'center'}}>No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </>
  );
};

export default UserDetailTab;
