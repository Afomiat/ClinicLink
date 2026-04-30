import React from 'react';
import styles from './MyDoctorsPage.module.css';

const RatingBreakdown = ({ reviews, rating }) => {
  // Calculate rating distribution (mock data for demo)
  const ratingDistribution = [
    { stars: 5, count: Math.round(reviews * 0.6), percentage: 60 },
    { stars: 4, count: Math.round(reviews * 0.2), percentage: 20 },
    { stars: 3, count: Math.round(reviews * 0.1), percentage: 10 },
    { stars: 2, count: Math.round(reviews * 0.05), percentage: 5 },
    { stars: 1, count: Math.round(reviews * 0.05), percentage: 5 }
  ];

  return (
    <div className={styles.ratingBreakdown}>
      <h3 className={styles.breakdownTitle}>Rating Breakdown</h3>
      <div className={styles.breakdownBars}>
        {ratingDistribution.map((item) => (
          <div key={item.stars} className={styles.breakdownRow}>
            <span className={styles.starsLabel}>{item.stars} star{item.stars !== 1 && 's'}</span>
            <div className={styles.barContainer}>
              <div 
                className={styles.barFill} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className={styles.countLabel}>({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBreakdown;