import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './MyDoctorsPage.module.css';

const StarRatingDisplay = ({ rating, size = 20 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.starRatingDisplay}>
      {[...Array(fullStars)].map((_, i) => (
        <FiStar key={`full-${i}`} className={styles.starFilled} size={size} />
      ))}
      {hasHalfStar && (
        <div className={styles.starHalfContainer} style={{ width: size }}>
          <FiStar className={styles.starHalf} size={size} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FiStar key={`empty-${i}`} className={styles.starEmpty} size={size} />
      ))}
      <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRatingDisplay;