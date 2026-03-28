import React from 'react';
import { Route , Routes } from 'react-router-dom';
import HomeMenu from './homeMenu.jsx';
import HotelBookingPage1 from './bookpage1.jsx';
import HotelBookingPage2 from './bookpage2.jsx';
import HotelBookingPage3 from './bookpage3.jsx';
import HotelBookingPage4 from './bookpage4.jsx';
import AboutUsMain from './AboutUsMain.jsx';
import Home from './HomePage.js'
import Dining from './Dining.jsx';
import Gymming from './Gym.jsx';
import Swimming from './Swimming.jsx';
import Spa from './Spa.jsx';
import BookingPageMain from './BookingPageMain.jsx';
import FeedbackForm from './Feedback.jsx';
import Footer from './footer.jsx';
import AdminLogin from './AdminLogin.jsx';
import Admin from './R_Admin.js';
import Amenities from './R_Amenities.js';
import RoomRatings from './R_RoomRatings.js';
import UserDetailTab from './UserDetailTab.jsx';

// --- 1. IMPORT THE PROTECTED ROUTE COMPONENT ---
import ProtectedRoute from './ProtectedRoute';

const App = () => {

  return(
    <>
      <HomeMenu/>
      <Routes>
        {/* --- Your Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUsMain />} />
        <Route path="/booking" element={<BookingPageMain />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/spa" element={<Spa />} />
        <Route path="/swimming" element={<Swimming />} />
        <Route path="/gym" element={<Gymming />} />
        <Route path="/b1" element={<HotelBookingPage1 />} />
        <Route path="/b2" element={<HotelBookingPage2 />} />
        <Route path="/b3" element={<HotelBookingPage3 />} />
        <Route path="/b4" element={<HotelBookingPage4 />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        
        {/* --- Public Admin Login Route --- */}
        <Route path='/login' element={<AdminLogin/>}/>
        
        {/* --- 2. WRAP YOUR ADMIN ROUTES --- */}
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Admin/>
            </ProtectedRoute>
          }
        /> 
        <Route 
          path='/amenities' 
          element={
            <ProtectedRoute>
              <Amenities/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/roomratings' 
          element={
            <ProtectedRoute>
              <RoomRatings/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/userdetails' 
          element={
            <ProtectedRoute>
              <UserDetailTab/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>  
  )
};
export default App;
