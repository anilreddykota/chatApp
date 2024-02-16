import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0); // Default rating is 0 stars

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsOpen(!localStorage.hasOwnProperty('hasProvidedFeedback'));
    }, 2 * 60 * 1000);
  
    return () => clearTimeout(timeoutId);
  }, []);
  

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    const feedbackData = {
      rating,
      comments: document.getElementById('feedback-comments').value,
    };

    try {
      const response = await axios.post('https://chatappserver-zop9.onrender.com/api/submit-feedback', feedbackData);
    //   console.log('Server response:', response.data);
      localStorage.setItem('hasProvidedFeedback', 'true');

    } catch (error) {
      console.error('Error submitting feedback:', error.message);
    }

    handleClose();
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
      
    <div className={`feedback-form ${isOpen ? 'open' : 'closed'}`}>
      <div className="form-content">
        <h2>We'd love to hear your feedback!</h2>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? 'selected' : ''}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea id="feedback-comments" placeholder="Share your experience..." />
        <div className='d-flex justify-content-around'>

        <button onClick={handleClose} className='btn btn-danger'>Close</button>
        <button onClick={handleSubmit} className='btn btn-success'>Submit</button>
        
        </div>
      </div>
    </div>  

  );
};

export default FeedbackForm;
