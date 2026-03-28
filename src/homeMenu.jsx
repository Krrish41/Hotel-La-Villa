import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navBar.css'; // Create this CSS file
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;700&display=swap" rel="stylesheet"></link>
const HomeMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo"><Link to='/' className='logo'>La Villa</Link></div>
        <ul className="nav-links">
          <Link to='/' className="nav-item">Home</Link>
          <Link to='/aboutus' className="nav-item">About Us</Link>
          <li className="nav-item1" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            Amenities
            <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
              <div className="dropdown-item"><Link to='/dining' className='dropdown-item'>Dining</Link></div>
              <div className="dropdown-item"><Link to='/spa' className='dropdown-item'>Spa</Link></div>
              <div className="dropdown-item"><Link to='/gym' className='dropdown-item'>Gym</Link></div>
              <div className="dropdown-item"><Link to='/swimming' className='dropdown-item'>Swimming</Link></div>
            </div>
          </li>
          <Link to='/feedback' className="nav-item">Feedback</Link>
        </ul>
      </div>
    </>
  );
};

export default HomeMenu;

// const Header = () => {
//   const [destinationsOpen, setDestinationsOpen] 