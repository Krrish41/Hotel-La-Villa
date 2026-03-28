import React from "react";
import "./HotelList.css";
import { Link } from "react-router-dom";

const hotel = {
  id: 1,
  name: "Luxury Beach Resort",
  rating: 4, // Hardcoded rating for display
  image: "https://source.unsplash.com/400x300/?hotel,resort",
};

const roomDetails = {
  "Single Bed": { 
    price: "₹3,000/night", 
    description: "Cozy single bed for one guest.", 
    location: "Garden View Wing", 
    rating: 4,  // Added rating
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    linked:"/b4"
  },
  "Double Bed": { 
    price: "₹5,000/night", 
    description: "Spacious room with a double bed for two.", 
    location: "Main Tower - Ocean View", 
    rating: 5,  // Added rating
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    linked:"/b3"
  },
  "Twin Bed": { 
    price: "₹7,000/night", 
    description: "Comfortable stay with two single beds.", 
    location: "Poolside Suites", 
    rating: 4,  // Added rating
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    linked:"/b2"
  },
  "Four Bed Suite": { 
    price: "₹12,000/night", 
    description: "Luxury suite with four beds, ideal for families.", 
    location: "Penthouse - Top Floor", 
    rating: 5,  // Added rating
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    linked:"/b1"
  }
};

export default function HotelList({ searchParams }) {
  const selectedRoom = roomDetails[searchParams.roomType] || roomDetails["Double Bed"];
  const otherRooms = Object.keys(roomDetails).filter(roomType => roomType !== searchParams.roomType);

  return (
    <div className="hotel-list">
      {/* Recommended Room Section */}
      <div className="hotel-card recommended-room">
        <div className="recommended-room-text">Recommended Room</div> {/* Added text */}
        <img src={selectedRoom.image} alt={searchParams.roomType} />
        <div className="hotel-info">
          <h3>{searchParams.roomType}</h3>
          <p><strong>Location:</strong> {selectedRoom.location}</p>
          <p className="price">{selectedRoom.price}</p>
          <p>{selectedRoom.description}</p>
          <p className="rating">Rating: {selectedRoom.rating} Stars</p> {/* Added rating */}
          {/* <Link className="book-button" to={selectedRoom.linked}>Book Now</Link> */}

          <Link 
            className="book-button" 
            to={selectedRoom.linked}
            state={{ 
              checkIn: searchParams.checkIn, 
              checkOut: searchParams.checkOut 
            }}
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Our Other Rooms Section */}
      <div className="other-rooms">
        <h3>Our Other Rooms</h3>
        <div className="other-rooms-list">
          {otherRooms.map(roomType => (
            <div key={roomType} className="hotel-card">
              <img src={roomDetails[roomType].image} alt={roomType} />
              <div className="hotel-info">
                <h3>{roomType}</h3>
                <p><strong>Location:</strong> {roomDetails[roomType].location}</p>
                <p className="price">{roomDetails[roomType].price}</p>
                <p>{roomDetails[roomType].description}</p>
                <p className="rating">Rating: {roomDetails[roomType].rating} Stars</p> {/* Added rating */}
                {/* <Link className="book-button" to={roomDetails[roomType].linked}>Book Now</Link> */}
                <Link 
                  className="book-button" 
                  to={roomDetails[roomType].linked}
                  state={{ 
                    checkIn: searchParams.checkIn, 
                    checkOut: searchParams.checkOut 
                  }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
