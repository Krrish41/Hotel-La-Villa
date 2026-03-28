import React, { useState } from 'react';
import './Feedback.css';
import Footer from './footer';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amenitiesRating, setAmenitiesRating] = useState(0);
  const [hospitalityRating, setHospitalityRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false); // New state for submission status
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      const resp = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, amenitiesRating, hospitalityRating, comments })
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit');
      }
    setName('');
    setEmail('');
    setAmenitiesRating(0);
    setHospitalityRating(0);
    setComments('');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <div className='container1'>  
    <div className="feedback-form">
      <h2>We Value Your Feedback</h2>
      <p className="subtitle">Help us enhance your experience at Hotel La Villa</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amenities Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${amenitiesRating >= star ? 'filled' : ''}`}
                onClick={() => setAmenitiesRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Hospitality Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${hospitalityRating >= star ? 'filled' : ''}`}
                onClick={() => setHospitalityRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comments">Additional Comments:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="5"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit Feedback</button>
        {submitted && <p className="success-message">Submitted Successfully!</p>} {/* Success message */}
      </form>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default FeedbackForm;
