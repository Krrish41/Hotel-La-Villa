import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import room1 from './pressuite1.jpg';
import room2 from './pressuite2.jpg';
import room3 from './pressuite3.jpg';
import room4 from './pressuite4.jpg';
import Footer from "./footer";


const HotelBookingPage1 = () => {
  // Color palette
  const colors = {
    background: '#FFFFF0',
    dark: '#352208',
    accent: '#E1BB80'
  };

  // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
  
  // State management
  const [selectedAmenities, setSelectedAmenities] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showBooked, setShowBooked] = useState(false);
  
  const location = useLocation();

  // Sample data
  const room = {
    name: 'Four Bed Suite',
    basePrice: 12000,
    images: [
      room1,room2,room3,room4,
    ],
    amenities: [
      { id: 1, name: 'Spa Access', price: 1500 },
      { id: 2, name: 'Gym Access', price: 800 },
      { id: 3, name: 'Breakfast', price: 900 },
      { id: 4, name: 'Airport Transfer', price: 2000 }
    ],
    description: 'Luxurious 4-bed suite with modern amenities and stunning city views...'
  };

  // Auto-scroll images
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
        setFade(true); // Start fade in
      }, 300); // Match this duration with the CSS transition duration
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate total price
  const totalPrice = room.basePrice + 
    Array.from(selectedAmenities).reduce((sum, id) => {
      const amenity = room.amenities.find(a => a.id === id);
      return sum + (amenity?.price || 0);
    }, 0);

  // Amenity selection handler
  const handleAmenityChange = (id) => {
    setSelectedAmenities(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Form input change handler
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Form submission handler (to be connected to MySQL later)
  const handleSubmit = async(e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all fields.");
      return;
    }
    
    const { checkIn, checkOut } = location.state || {};

    if (!checkIn || !checkOut) {
      alert("Error: Check-in and Check-out dates are missing. Please go back and search again.");
      return;
    }

    const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        roomType: room.name, // From the 'room' object
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: totalPrice,
        amenities: Array.from(selectedAmenities) // Convert Set to Array
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', phone: '' });
        setShowBooked(true);
      } else {
        // Handle server errors
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      // Handle network errors
      console.error('Network Error:', error);
      alert('Booking failed: Could not connect to the server.');
    }
  };
    // // Here you would typically send formData to your backend
    // console.log('Form submitted:', formData);
    // // Reset form after submission
    // setFormData({ name: '', email: '', phone: '' });
    // setSubmitted(true); // Set submitted status to true
  // };

  return (
    <>
    <div style={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '2rem',
      display: 'flex',
      gap: '2rem',
      marginTop:'50px',
    }}>
      {/* Left Section */}
      <div style={{ flex: 2 }}>
        {/* Image Carousel */}
        <div style={{
          height: '700px',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={room.images[currentImageIndex]} 
            alt="Room" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease-in-out',
              opacity: fade ? 1 : 0
            }}
          />
        </div>

        {/* Room Description */}
        <div style={{ marginTop: '2rem', color: colors.dark, backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          
          }}>
          <h2 style={{ color: colors.accent, marginBottom: '1rem', fontSize: "2.25rem" }}>4-Bedroom Luxury Suite</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Experience the pinnacle of luxury in our exquisite 4-Bedroom Luxury Suite, designed for families, 
            groups, or those who simply desire extra space and elegance. Spanning an expansive layout, 
            this suite blends sophisticated design with modern comfort, offering breathtaking views and 
            top-tier amenities.
          </p>

          <h3 style={{ color: colors.accent, marginBottom: '1rem' }}>Suite Features</h3>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginBottom: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ Four Elegantly Appointed Bedrooms – Each featuring plush king or queen-sized beds, premium linens, and ample closet space</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Spacious Living Area – A beautifully furnished lounge perfect for relaxation or entertaining guests</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Private Dining Space – A refined setting to enjoy meals with family and friends</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Gourmet Kitchen – Equipped with high-end appliances for added convenience</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Luxurious Bathrooms – Spa-inspired en-suite bathrooms with deep soaking tubs, rainfall showers, and designer toiletries</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Private Balcony or Terrace – Offering stunning views of the city skyline, ocean, or lush gardens</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ State-of-the-Art Technology – High-speed Wi-Fi, smart TVs, and a premium sound system</li>
          </ul>

          <h3 style={{ color: colors.accent, marginBottom: '1rem' }}>Exclusive Perks</h3>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginBottom: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>★ 24/7 Personalized Concierge Service</li>
            <li style={{ marginBottom: '0.5rem' }}>★ Private Butler (Upon Request)</li>
            <li style={{ marginBottom: '0.5rem' }}>★ Daily Housekeeping & Turn-Down Service</li>
            <li style={{ marginBottom: '0.5rem' }}>★ Access to VIP Lounge & Private Pool Area</li>
          </ul>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
            Indulge in the finest comforts and make unforgettable memories in our 4-Bedroom Luxury Suite. 
            Book your stay today for an unparalleled hospitality experience.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ flex: 1 }}>
        <div style={{
          height:'730px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Price Display */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: colors.dark, fontSize:'1.5rem'}}>Your Stay</h3>
            <div style={{ 
              fontSize: '3rem', 
              color: colors.accent,
              fontWeight: 'bold'
            }}>
              ${totalPrice.toLocaleString()}
            </div>
            <p style={{ color: colors.dark, fontSize:'1rem' }}>for 1 night</p>
          </div>

          {/* Amenities Selection */}
          <div style={{ borderTop: `1px solid ${colors.accent}`, paddingTop: '1rem' }}>
            <h4 style={{ color: colors.dark , fontSize:'1.25rem'}}>Add Amenities</h4>
            {room.amenities.map(amenity => (
              <label key={amenity.id} style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5rem 0',
                color: colors.dark
              }}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.has(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{fontSize:'1rem'}}>{amenity.name} (+₹{amenity.price.toLocaleString()})</span>
              </label>
            ))}
          </div>

          {/* Form for customer details */}
<form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
  <h4 style={{ color: colors.dark, fontSize: '1.25rem', marginBottom:'1rem' }}>Customer Details</h4>
  <div style={{ marginBottom: '1rem' }}>
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleInputChange}
      required
      style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleInputChange}
      required
      style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <input
      type="text"
      name="phone"
      placeholder="Phone Number"
      value={formData.phone}
      onChange={handleInputChange}
      required
      pattern="\d{10}" // This pattern allows only digits
      title="Phone number must contain only digits."
      style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
  </div>

          {/* Book Now Button */}
          <button type='submit' style={{
            backgroundColor: colors.accent,
            color: colors.dark,
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '5px',
            width: '100%',
            marginTop: '4rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize:"1.25rem"
          }}>
            Book Now
          </button>
          {showBooked && (
            <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
              <div style={{background:'#fffff0', padding:'24px 28px', borderRadius:'10px', textAlign:'center', minWidth:'280px'}}>
                <div style={{fontSize:'28px', color:'#28a745'}}>✓</div>
                <h3 style={{margin:'8px 0 12px', color:colors.dark}}>Room Booked</h3>
                <button onClick={()=>setShowBooked(false)} style={{padding:'10px 18px', background:colors.accent, color:colors.dark, border:'none', borderRadius:'6px', cursor:'pointer'}}>OK</button>
              </div>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default HotelBookingPage1;