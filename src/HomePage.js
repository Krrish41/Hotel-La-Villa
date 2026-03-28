import React from 'react';
import './HomePage.css'; 
import { Link } from 'react-router-dom';
import Footer from './footer';

const Home = () => {
    return (
        <>
        <div className="container">
            <video autoPlay loop muted playsInline className="background-clip" title="Hotel Tour" src="https://assets-cug1-825v2.tajhotels.com/video/TAJ%20WEBSITE%20FILM_1920%20X%20930_148mb.mp4?Impolicy=Medium_High">
            </video>
            <div className="content">
                <h1>La Villa</h1>
                <Link to='/booking' className="bookNowButton">Book Now!</Link>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Home;