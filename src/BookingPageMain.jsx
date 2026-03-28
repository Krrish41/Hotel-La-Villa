import React, { useEffect, useState } from "react";
import HotelSearch from "./HotelSearch";
import HotelList from "./HotelList";
import "./App.css";
import Footer from "./footer";
function BookingPageMain() {
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastSearch');
    if (saved) {
      try { setSearchParams(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  return (
    <>
    <div className="App">
      <HotelSearch onSearch={setSearchParams} />
      {searchParams && <HotelList searchParams={searchParams} />}
    </div>
    {/* <footer><Footer/></footer> */}
    </>
  );
}

export default BookingPageMain;