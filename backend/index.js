// backend/index.js

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Disable caching for API responses to ensure fresh stats
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// --- Database Connection Config ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Add connection settings for date parsing
    dateStrings: true 
};

// ===================================
// === BOOKING ENDPOINT (UNCHANGED) ===
// ===================================
app.post('/api/bookings', async (req, res) => {
  const { 
    name, email, phone, roomType, checkIn, checkOut, totalPrice, amenities 
  } = req.body;

  if (!name || !email || !phone || !roomType || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const insertQuery = `
    INSERT INTO bookings 
    (customer_name, customer_email, customer_phone, room_type, check_in_date, check_out_date, total_price, amenities, booking_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(insertQuery, [
      name, email, phone, roomType, checkIn, checkOut,
      totalPrice, JSON.stringify(amenities)
    ]);
    await connection.end();
    res.status(201).json({ message: 'Booking successful!' });

  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Failed to create booking.', error: error.message });
  }
});

// Amenity pricing map used for computing statistics (INR)
const AMENITY_PRICES_INR = {
  1: 1500,   // Spa Access
  2: 800,    // Gym Access
  3: 900,    // Breakfast
  4: 2000    // Airport Transfer
};

// Room capacities by type
const ROOM_CAPACITY = {
  'Single Bed': 50,
  'Twin Bed': 20,
  'Double Bed': 20,
  'Four Bed Suite': 10
};

// =========================================
// === ADMIN LOGIN ENDPOINT (UNCHANGED) ===
// =========================================
app.post('/api/admin-login', (req, res) => {
  const { email, password } = req.body;
  const MOCK_ADMIN_EMAIL = "manager@gmail.com";
  const MOCK_ADMIN_PASSWORD = "admin123";

  if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
    const payload = { user: { email: email, role: "admin" } };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ success: true, token: token });

  } else {
    res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }
});

// ==============================================
// === JWT VERIFICATION MIDDLEWARE (UNCHANGED) ===
// ==============================================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

// =======================================================================
// === NEW PROTECTED ROUTE FOR ADMIN BOOKING SEARCH (REPLACES OLD ONE) ===
// =======================================================================
app.get('/api/admin/bookings', verifyToken, async (req, res) => {
  console.log('Accessing protected bookings route for:', req.user.email);
  
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Base query
    let sql = 'SELECT * FROM bookings';
    
    // Dynamically build WHERE clause
    const whereClauses = [];
    const params = [];
    
    const { 
      name, email, phone, roomType, checkIn, 
      checkOut, amenities, bookingDate 
    } = req.query;

    if (name) {
      whereClauses.push('customer_name LIKE ?');
      params.push(`%${name}%`);
    }
    if (email) {
      whereClauses.push('customer_email LIKE ?');
      params.push(`%${email}%`);
    }
    if (phone) {
      whereClauses.push('customer_phone LIKE ?');
      params.push(`%${phone}%`);
    }
    if (roomType) {
      whereClauses.push('room_type = ?');
      params.push(roomType);
    }
    if (checkIn) {
      whereClauses.push('check_in_date = ?');
      params.push(checkIn);
    }
    if (checkOut) {
      whereClauses.push('check_out_date = ?');
      params.push(checkOut);
    }
    if (bookingDate) {
      // Compare just the date part
      whereClauses.push('DATE(booking_date) = ?');
      params.push(bookingDate);
    }
    if (amenities) {
      // Search inside the JSON array
      whereClauses.push('JSON_CONTAINS(amenities, ?)');
      params.push(`"${amenities}"`); // Search for the amenity as a string in the JSON array
    }

    // Append all WHERE clauses to the base query
    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }
    
    // Add ordering
    sql += ' ORDER BY booking_date DESC';

    console.log('Executing SQL:', sql);
    console.log('With Params:', params);

    const [rows] = await connection.execute(sql, params);
    
    await connection.end();
    
    res.json(rows); // Send all matching bookings

  } catch (error) {
    console.error('Database Search Error:', error);
    if (connection) await connection.end();
    res.status(500).json({ message: 'Failed to fetch bookings.', error: error.message });
  }
});

// ===============================================================
// === ADMIN DASHBOARD STATS: weekly sales, rooms, staff, types ===
// ===============================================================
app.get('/api/admin/stats', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Weekly window
    const [weeklyRows] = await connection.execute(
      `SELECT id, total_price, amenities, room_type
       FROM bookings
       WHERE booking_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );

    // Count bookings that haven't checked out yet (for availability calculation)
    // This shows currently active + future bookings that block rooms
    const [activeCountRows] = await connection.execute(
      `SELECT COUNT(*) AS activeCount 
       FROM bookings 
       WHERE DATE(check_out_date) >= CURDATE()`
    );
    const roomsBooked = Number(activeCountRows[0]?.activeCount || 0);
    console.log('Active rooms booked (not checked out):', roomsBooked);

    // Count by room type - bookings that haven't checked out yet
    const [activeByTypeRows] = await connection.execute(
      `SELECT room_type, COUNT(*) as cnt 
       FROM bookings 
       WHERE DATE(check_out_date) >= CURDATE()
       GROUP BY room_type`
    );
    const activeByType = activeByTypeRows.reduce((acc, r) => {
      acc[r.room_type] = r.cnt;
      return acc;
    }, {});

    // Compute weekly totals
    let totalWeeklySales = 0;
    let weeklyAmenitiesSales = 0;
    weeklyRows.forEach(row => {
      const total = Number(row.total_price) || 0;
      totalWeeklySales += total;
      let amenitiesCost = 0;
      try {
        const arr = typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities;
        if (Array.isArray(arr)) {
          arr.forEach((id) => {
            const price = AMENITY_PRICES_INR[id] || 0;
            amenitiesCost += price;
          });
        }
      } catch (_) {
        // ignore parse errors
      }
      weeklyAmenitiesSales += amenitiesCost;
    });
    const weeklyRoomSales = Math.max(totalWeeklySales - weeklyAmenitiesSales, 0);

    // Rooms/staff availability calculation
    // Total rooms: 100, Total staff: 200
    // Each booking: -1 room, -2 staff
    const totalRooms = 100;
    const totalStaff = 200;
    const roomsAvailable = Math.max(totalRooms - roomsBooked, 0);
    const staffAllocated = roomsBooked * 2; // 2 staff per room booked
    const staffAvailable = Math.max(totalStaff - staffAllocated, 0);
    
    console.log(`Rooms: ${roomsBooked} booked, ${roomsAvailable} available`);
    console.log(`Staff: ${staffAllocated} allocated, ${staffAvailable} available`);

    // Room availability by type
    const roomsAvailableByType = Object.entries(ROOM_CAPACITY).reduce((acc, [type, capacity]) => {
      const active = activeByType[type] || 0;
      acc[type] = Math.max(capacity - active, 0);
      return acc;
    }, {});

    await connection.end();

    res.set('Cache-Control', 'no-store');
    res.json({
      weekly: {
        totalSales: totalWeeklySales,
        amenitiesSales: weeklyAmenitiesSales,
        roomSales: weeklyRoomSales
      },
      availability: {
        roomsAvailable,
        staffAvailable,
        byType: roomsAvailableByType
      }
    });
  } catch (error) {
    if (connection) await connection.end();
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to compute stats', error: error.message });
  }
});

// ============================================
// === AMENITIES STATS (weekly by categories) ===
// ============================================
app.get('/api/admin/amenities/stats', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Get ALL bookings with amenities from the bookings table
    const [rows] = await connection.execute(
      `SELECT amenities FROM bookings 
       WHERE amenities IS NOT NULL 
       AND amenities != ''
       AND amenities != '[]'
       AND amenities != 'null'`
    );

    console.log(`Processing ${rows.length} bookings with amenities`);
    const totals = { Spa: 0, Gym: 0, Breakfast: 0, 'Airport Transfer': 0 };
    
    rows.forEach((r, idx) => {
      try {
        let amenitiesArray = null;
        
        // Handle string format
        if (typeof r.amenities === 'string') {
          const trimmed = r.amenities.trim();
          if (trimmed === '' || trimmed === '[]' || trimmed === 'null') {
            return;
          }
          try {
            amenitiesArray = JSON.parse(trimmed);
          } catch (parseErr) {
            console.error(`Row ${idx}: JSON parse error:`, parseErr.message, 'Value:', trimmed.substring(0, 50));
            return;
          }
        } else if (Array.isArray(r.amenities)) {
          amenitiesArray = r.amenities;
        } else {
          return;
        }
        
        // Process array of amenity IDs
        if (Array.isArray(amenitiesArray) && amenitiesArray.length > 0) {
          amenitiesArray.forEach((amenityId) => {
            const id = Number(amenityId);
            if (id === 1) totals['Spa'] += AMENITY_PRICES_INR[1];
            else if (id === 2) totals['Gym'] += AMENITY_PRICES_INR[2];
            else if (id === 3) totals['Breakfast'] += AMENITY_PRICES_INR[3];
            else if (id === 4) totals['Airport Transfer'] += AMENITY_PRICES_INR[4];
          });
        }
      } catch (e) { 
        console.error(`Row ${idx} error:`, e.message);
      }
    });

    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    console.log('Amenities earnings:', totals, 'Total:', total);
    
    await connection.end();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({ total, breakdown: totals });
  } catch (error) {
    if (connection) await connection.end();
    console.error('Amenities Stats Error:', error);
    res.status(500).json({ message: 'Failed to compute amenities stats', error: error.message });
  }
});

// ===============================
// === BOOKINGS ADMIN CRUD API ===
// ===============================
app.put('/api/admin/bookings/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const allowed = ['customer_name','customer_email','customer_phone','room_type','check_in_date','check_out_date','total_price','amenities'];
  const fields = [];
  const params = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(key === 'amenities' ? JSON.stringify(req.body[key]) : req.body[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ message: 'No valid fields to update' });
  params.push(id);
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute(`UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`, params);
    await connection.end();
    res.json({ message: 'Booking updated' });
  } catch (e) {
    if (connection) await connection.end();
    res.status(500).json({ message: 'Failed to update booking', error: e.message });
  }
});

app.delete('/api/admin/bookings/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM bookings WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Booking deleted' });
  } catch (e) {
    if (connection) await connection.end();
    res.status(500).json({ message: 'Failed to delete booking', error: e.message });
  }
});

// ============================
// === FEEDBACK ADMIN VIEWS ===
// ============================
app.get('/api/admin/feedback', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM feedback ORDER BY submitted_at DESC');
    await connection.end();
    res.set('Cache-Control', 'no-store');
    res.json(rows);
  } catch (e) {
    if (connection) await connection.end();
    res.status(500).json({ message: 'Failed to fetch feedback', error: e.message });
  }
});

// ============================================
// === AMENITIES BOOKINGS DETAILS BY TYPE ===
// ============================================
app.get('/api/admin/amenities/bookings', verifyToken, async (req, res) => {
  const { amenity } = req.query;
  const amenityMap = { 'Spa': 1, 'Gym': 2, 'Breakfast': 3, 'Airport Transfer': 4 };
  const amenityId = amenityMap[amenity];
  
  // If amenity is not in the map, return empty array
  if (!amenityId) {
    res.set('Cache-Control', 'no-store');
    return res.json([]);
  }
  
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    // Get all bookings - use booking_date for when booking was made, fallback to check_in_date
    const [rows] = await connection.execute(
      `SELECT id, customer_name, booking_date, check_in_date, check_out_date, amenities, total_price
       FROM bookings
       ORDER BY COALESCE(booking_date, check_in_date) DESC, id DESC`,
      []
    );
    console.log(`Total bookings fetched: ${rows.length}, looking for amenity ID: ${amenityId}`);
    const result = rows
      .map(r => {
        try {
          // Parse amenities JSON
          let amenitiesArray = [];
          if (r.amenities) {
            if (typeof r.amenities === 'string') {
              try {
                amenitiesArray = JSON.parse(r.amenities);
              } catch (parseErr) {
                console.error('JSON parse error for booking ID:', r.id, parseErr);
                amenitiesArray = [];
              }
            } else if (Array.isArray(r.amenities)) {
              amenitiesArray = r.amenities;
            } else if (typeof r.amenities === 'object') {
              amenitiesArray = Object.values(r.amenities);
            }
          }
          
          // Check if this booking includes the requested amenity
          if (Array.isArray(amenitiesArray) && amenitiesArray.includes(amenityId)) {
            const amenityCost = AMENITY_PRICES_INR[amenityId] || 0;
            
            // Format booking_date
            let formattedBookingDate = 'N/A';
            if (r.booking_date) {
              const bd = r.booking_date;
              if (typeof bd === 'string') {
                formattedBookingDate = bd.split(' ')[0].split('T')[0];
              } else if (bd instanceof Date) {
                formattedBookingDate = bd.toISOString().split('T')[0];
              } else {
                formattedBookingDate = String(bd).split(' ')[0].split('T')[0];
              }
            }
            
            // Format check_in_date
            let formattedCheckIn = 'N/A';
            if (r.check_in_date) {
              const cid = r.check_in_date;
              if (typeof cid === 'string') {
                formattedCheckIn = cid.split(' ')[0].split('T')[0];
              } else if (cid instanceof Date) {
                formattedCheckIn = cid.toISOString().split('T')[0];
              } else {
                formattedCheckIn = String(cid).split(' ')[0].split('T')[0];
              }
            }
            
            // Format check_out_date
            let formattedCheckOut = 'N/A';
            if (r.check_out_date) {
              const cod = r.check_out_date;
              if (typeof cod === 'string') {
                formattedCheckOut = cod.split(' ')[0].split('T')[0];
              } else if (cod instanceof Date) {
                formattedCheckOut = cod.toISOString().split('T')[0];
              } else {
                formattedCheckOut = String(cod).split(' ')[0].split('T')[0];
              }
            }
            
            return {
              customer_name: r.customer_name || 'N/A',
              booking_date: formattedBookingDate,
              check_in_date: formattedCheckIn,
              check_out_date: formattedCheckOut,
              amenity_cost: amenityCost
            };
          }
        } catch (e) {
          console.error('Error parsing amenities for booking ID:', r.id, e);
        }
        return null;
      })
      .filter(r => r !== null);
    console.log(`Filtered bookings with amenity ${amenityId}: ${result.length}`);
    await connection.end();
    res.set('Cache-Control', 'no-store');
    res.json(result);
  } catch (e) {
    if (connection) await connection.end();
    console.error('Amenities bookings error:', e);
    res.status(500).json({ message: 'Failed to fetch amenity bookings', error: e.message });
  }
});

// ==============================
// === FEEDBACK SUBMISSION API ===
// ==============================
app.post('/api/feedback', async (req, res) => {
  const { name, email, amenitiesRating, hospitalityRating, comments } = req.body;
  if (!name || !email || amenitiesRating == null || hospitalityRating == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `INSERT INTO feedback (name, email, amenities_rating, hospitality_rating, comments)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, amenitiesRating, hospitalityRating, comments || null]
    );
    await connection.end();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    if (connection) await connection.end();
    console.error('Feedback Error:', error);
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

