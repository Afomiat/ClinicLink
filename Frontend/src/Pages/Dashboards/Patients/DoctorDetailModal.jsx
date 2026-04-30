import React, { useState } from 'react';
import { 
  FiCheckCircle, FiUser, FiStar, FiCalendar, 
  FiMapPin, FiPhone, FiMail, FiPlus
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MyDoctorsPage.module.css';
import StarRatingDisplay from './StarRatingDisplay';
import RatingBreakdown from './RatingBreakdown';
import RateDoctorModal from './RateDoctorModal';

const DoctorDetailModal = ({ doctor, onClose, isMyDoctor, onAddDoctor , onReschedule,onBookAppointment}) => {
  const [showRateModal, setShowRateModal] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [reviews, setReviews] = useState(doctor.reviews);
  const [averageRating, setAverageRating] = useState(doctor.rating);

  const handleRateDoctor = () => {
    setShowRateModal(true);
  };

  const handleSubmitRating = (ratingData) => {
    console.log('Rating submitted:', ratingData);
    setUserRating(ratingData.rating);

    // Update average rating (simple example)
    const newAverage = ((averageRating * reviews) + ratingData.rating) / (reviews + 1);
    setAverageRating(newAverage);
    setReviews(reviews + 1);
  };

  return (
    <motion.div 
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {!showRateModal && (
        <motion.div 
          className={styles.doctorModal}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.modalHero}>
            <div className={styles.heroImageContainer}>
              <img src={doctor.image} alt={doctor.name} className={styles.heroImage} />
            </div>
            <div className={styles.heroContent}>
              <div className={styles.verifiedBadge}>
                <FiCheckCircle /> Verified Doctor
              </div>
              <h1 className={styles.doctorName}>{doctor.name}</h1>
              <p className={styles.doctorSpecialty}>{doctor.specialty}</p>

              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  {/* <FiStar className={styles.statIcon} /> */}
                  <div>
                    <span className={styles.statValue}>{averageRating.toFixed(1)}</span>
                    <span className={styles.statLabel}>Rating</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <FiUser className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{reviews}</span>
                    <span className={styles.statLabel}>Reviews</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <FiCalendar className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{doctor.experience}</span>
                    <span className={styles.statLabel}>Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalContent}>
            <div className={styles.contentGrid}>
              <div className={styles.mainContent}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <FiUser className={styles.sectionIcon} />
                    About Dr. {doctor.name.split(' ')[1]}
                  </h2>
                  <p className={styles.sectionText}>{doctor.about}</p>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <FiStar className={styles.sectionIcon} />
                    Education & Qualifications
                  </h2>
                  <ul className={styles.qualificationsList}>
                    {doctor.education.map((item, index) => (
                      <li key={index} className={styles.qualificationItem}>
                        <div className={styles.qualificationBullet}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className={styles.sidebar}>
                <div className={styles.contactCard}>
                  <h3 className={styles.contactTitle}>Contact Information</h3>
                  <div className={styles.contactItem}>
                    <FiPhone className={styles.contactIcon} />
                    <div>
                      <span className={styles.contactLabel}>Phone</span>
                      <span className={styles.contactValue}>{doctor.contact.phone}</span>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <FiMail className={styles.contactIcon} />
                    <div>
                      <span className={styles.contactLabel}>Email</span>
                      <span className={styles.contactValue}>{doctor.contact.email}</span>
                    </div>
                  </div>
                  {/* <div className={styles.contactItem}>
                    <FiMapPin className={styles.contactIcon} />
                    <div>
                      <span className={styles.contactLabel}>Address</span>
                      <span className={styles.contactValue}>{doctor.contact.address}</span>
                    </div>
                  </div> */}
                </div>

                {doctor.upcomingAppointment && (
                  <div className={styles.appointmentCard}>
                    <h3 className={styles.appointmentTitle}>Next Appointment</h3>
                    <div className={styles.appointmentTime}>
                      <FiCalendar className={styles.appointmentIcon} />
                      <span>{doctor.upcomingAppointment}</span>
                    </div>
                    <button 
                        onClick={onReschedule} 
                        className={styles.rescheduleButton}
                      >
                        Reschedule Appointment
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            {!isMyDoctor && (
              <button 
                className={styles.secondaryButton}
                onClick={() => onAddDoctor(doctor)}
              >
                <FiPlus /> Add to My Doctors
              </button>
            )}
            {isMyDoctor && (
            <button 
              className={`${styles.secondaryButton} ${styles.rate}`}
              onClick={handleRateDoctor}
            >
              <FiStar /> Rate Doctor
            </button>
             )}
            <button 
              className={styles.primaryButton}
              onClick={() => onBookAppointment(doctor)} 

            >
              <FiCalendar /> Book Appointment
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showRateModal && (
          <RateDoctorModal
            doctor={doctor}
            onClose={() => setShowRateModal(false)}
            onSubmit={handleSubmitRating}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DoctorDetailModal;
