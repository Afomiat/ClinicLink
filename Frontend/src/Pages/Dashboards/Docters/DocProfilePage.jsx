import React, { useState, useEffect } from 'react';
import { FaCamera, FaUserMd, FaEnvelope, FaPhone, FaHeartbeat, FaEdit, FaSave, FaInfoCircle, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import styles from './DocProfile.module.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
    const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchedData = {
      firstName: 'Dr. Someone',
      lastName: 'father name',
      specialty: 'Cardiologist',
      email: 'dr.someone@example.com',
      phone: '+1 (234) 567-890',
      bio: 'this is my bio for now',
      rating: 4.3, // Changed to match your reference image
      ratingCount: 2115,
    };
    setProfileData(fetchedData);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditInfo = () => {
    setIsEditingInfo((prev) => !prev);
  };
  
  const toggleEditBio = () => {
    setIsEditingBio((prev) => !prev);
  };
  

  const formatRatingCount = (count) => {
    return count.toLocaleString(); // Formats number with commas
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
    }
    
    // Add half star if decimal part is >= 0.3 and < 0.8
    if (decimalPart >= 0.3 && decimalPart < 0.8) {
      stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
    } 
    // Add full star if decimal part >= 0.8
    else if (decimalPart >= 0.8) {
      stars.push(<FaStar key={`full-${fullStars}`} color="#FFD700" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} color="#FFD700" />);
    }
    
    return (
      <div className={styles.ratingContainer}>
        <div className={styles.ratingText}>
          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          
        </div>
        <div className={styles.stars}>{stars}</div>
        <div>
        {profileData.ratingCount && (
            <span className={styles.ratingCount}>
              {formatRatingCount(profileData.ratingCount)} ratings
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileDetails}>
        {/* Profile Picture */}
        <div className={styles.picture}>
          <div className={styles.Namepic}>
            <div className={styles.avatar}>
              {photo ? (
                <img src={photo} alt="Doctor Avatar" className={styles.avatarImage} />
              ) : (
                <div className={styles.defaultAvatar}></div>
              )}
            </div>
            <h3>{profileData.firstName}</h3>
            {renderStars(profileData.rating)}
          </div>

          {/* Upload Photo */}
          <label htmlFor="upload-photo" className={styles.uploadPhotoButton}>
            <FaCamera />
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Personal Info Section */}
        <div className={`${styles.section} ${styles.Info}`}>
          <div className={styles.InfoInside}>
            <h3>Personal Information</h3>

            <div className={styles.name}>
              <div>
                <label><FaUserMd color="#2B6CB0" /> First Name</label>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.firstName}</p>
                )}
              </div>
              <div>
                <label><FaUserMd color="#2B6CB0" /> Last Name</label>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.lastName}</p>
                )}
              </div>
            </div>

            <div className={styles.phoneEmail}>
              <div>
                <label><FaEnvelope color="#3182CE" /> Email</label>
                {isEditingInfo ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>

              <div>
                <label><FaPhone color="#38A169" /> Phone</label>
                {isEditingInfo ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
            </div>

            <div className={styles.bioSpeciality}>
              <div>
                <label><FaHeartbeat color="#E53E3E" /> Specialty</label>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="specialty"
                    value={profileData.specialty}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profileData.specialty}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button className={styles.InfoButton} onClick={toggleEditInfo}>
              {isEditingInfo ? (
                <>
                  <FaSave color="#000" style={{ marginRight: '6px' }} /> Save
                </>
              ) : (
                <>
                  <FaEdit color="#000" style={{ marginRight: '6px' }} /> Edit
                </>
              )}
            </button>
          </div>
        </div>

        <div className={`${styles.bioInfo} ${styles.section}`}>
          <div>
          <label><FaInfoCircle color="#805AD5" /> Bio</label>

          {isEditingInfo ? (
            
            <input
              type="text"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
            />
          ) : (
            <p>{profileData.bio}</p>
          )}
          </div>
        
          <div>
            <button className={styles.bioButton} onClick={toggleEditBio}>
              {isEditingBio ? (
                <>
                  <FaSave color="#000" style={{ marginRight: '6px' }} /> Save
                </>
              ) : (
                <>
                  <FaEdit color="#000" style={{ marginRight: '6px' }} /> Edit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;