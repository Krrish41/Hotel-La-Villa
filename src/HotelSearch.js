import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./HotelSearch.css";

export default function HotelSearch({ onSearch }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomType, setRoomType] = useState("Double Bed"); // Default selection
  const [rating, setRating] = useState(3); // Rating selection for display only

  useEffect(() => {
    const saved = localStorage.getItem('lastSearch');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.checkIn) setCheckIn(new Date(s.checkIn));
        if (s.checkOut) setCheckOut(new Date(s.checkOut));
        if (s.roomType) setRoomType(s.roomType);
        if (s.rating) setRating(s.rating);
        onSearch(s);
      } catch (_) {}
    }
  }, [onSearch]);

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please fill in all fields before searching!");
      return;
    }

    // --- START OF MODIFICATION ---
    // Helper function to format a Date object to "YYYY-MM-DD"
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    // Format the dates before passing them
    const formattedCheckIn = formatDate(checkIn);
    const formattedCheckOut = formatDate(checkOut);
    // --- END OF MODIFICATION ---

    // Pass the formatted strings instead of the Date objects
    const params = { checkIn: formattedCheckIn, checkOut: formattedCheckOut, roomType, rating };
    localStorage.setItem('lastSearch', JSON.stringify(params));
    onSearch(params);
  };

  return (
    <div className="search-container">
      <DatePicker
        selected={checkIn}
        onChange={(date) => setCheckIn(date)}
        className="search-input"
        placeholderText="Check-in"
        dateFormat="EEE, d MMM yyyy"
      />

      <DatePicker
        selected={checkOut}
        onChange={(date) => setCheckOut(date)}
        className="search-input"
        placeholderText="Check-out"
        dateFormat="EEE, d MMM yyyy"
        minDate={checkIn}
      />

      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="search-input"
      >
        <option>Single Bed</option>
        <option>Double Bed</option>
        <option>Twin Bed</option>
        <option>Four Bed Suite</option>
      </select>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="search-input"
      >
        <option value={1}>1 Star</option>
        <option value={2}>2 Stars</option>
        <option value={3}>3 Stars</option>
        <option value={4}>4 Stars</option>
        <option value={5}>5 Stars</option>
      </select>

      <button onClick={handleSearch} className="search-button">
        SEARCH
      </button>
    </div>
  );
}
