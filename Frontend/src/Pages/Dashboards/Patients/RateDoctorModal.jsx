import React, { useState } from 'react';
import { FiStar, FiX, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './MyDoctorsPage.module.css';

const RateDoctorModal = ({ doctor, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recommend, setRecommend] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        doctorId: doctor.id,
        rating,
        feedback,
        recommend,
        date: new Date().toISOString()
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <motion.div 
      className={styles.rateModalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={styles.rateModal}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.rateModalClose} onClick={onClose}>
          <FiX />
        </button>
        
        <div className={styles.rateModalHeader}>
          <img src={doctor.image} alt={doctor.name} className={styles.rateDoctorImage} />
          <h2>Rate Your Experience</h2>
          <p>How was your experience with Dr. {doctor.name.split(' ')[1]}?</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.rateForm}>
          <div className={styles.ratingInput}>
            <div className={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starButton} ${
                    (hoverRating || rating) >= star ? styles.starActive : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <FiStar size={32} />
                </button>
              ))}
            </div>
            <div className={styles.ratingLabels}>
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className={styles.recommendInput}>
            <p>Would you recommend this doctor?</p>
            <div className={styles.recommendButtons}>
              <button
                type="button"
                className={`${styles.recommendButton} ${
                  recommend === true ? styles.recommendYesActive : ''
                }`}
                onClick={() => setRecommend(true)}
              >
                <FiThumbsUp /> Yes
              </button>
              <button
                type="button"
                className={`${styles.recommendButton} ${
                  recommend === false ? styles.recommendNoActive : ''
                }`}
                onClick={() => setRecommend(false)}
              >
                <FiThumbsDown /> No
              </button>
            </div>
          </div>
          
          <div className={styles.feedbackInput}>
            <label htmlFor="feedback">Share your experience (optional)</label>
            <textarea
              id="feedback"
              placeholder="What did you like or dislike? Would you visit again?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className={styles.submitRatingButton}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RateDoctorModal;