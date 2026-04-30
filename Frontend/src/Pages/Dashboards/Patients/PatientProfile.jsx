import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBirthdayCake,
  FaVenusMars,
  FaIdCard,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaGlobe,
  FaCalendarAlt,
  FaBell,
  FaCamera,
  FaTrash
} from 'react-icons/fa';
import styles from './PatientProfile.module.css';

const PatientProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Track which sections are being edited
  const [editingSections, setEditingSections] = useState({
    personal: false,
    medical: false,
    emergency: false
  });

  const [patientData, setPatientData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+251 912 345 678',
    address: 'Bole Subcity, Addis Ababa, Ethiopia',
    dob: '1985-06-15',
    gender: 'Male',
    bloodType: 'A+',
    insuranceId: 'INS-789456123',
    emergencyContact: {
      name: 'Sarah Smith',
      phone: '+251 911 987 654',
      relationship: 'Spouse'
    },
    preferences: {
      language: 'English',
      notifications: true
    }
  });

  const [formData, setFormData] = useState({ ...patientData });
  const [avatar, setAvatar] = useState('JS');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  useEffect(() => {
    // Simulate fetching patient data from API
    const fetchPatientData = async () => {
      try {
        // In a real app, you would fetch this from your backend
        const data = {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '+251 912 345 678',
          address: 'Bole Subcity, Addis Ababa, Ethiopia',
          dob: '1985-06-15',
          gender: 'Male',
          bloodType: 'A+',
          insuranceId: 'INS-789456123',
          emergencyContact: {
            name: 'Sarah Smith',
            phone: '+251 911 987 654',
            relationship: 'Spouse'
          },
          preferences: {
            language: 'English',
            notifications: true
          }
        };
        setPatientData(data);
        setFormData(data);
        setAvatar(`${data.firstName.charAt(0)}${data.lastName.charAt(0)}`);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setUploadStatus('error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    setUploadStatus('uploading');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 2000);
      }
    }, 200);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setUploadStatus(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const handleSectionSave = (section) => {
    setPatientData(formData);
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
    // Update avatar initials if name changed
    if (section === 'personal') {
      setAvatar(`${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`);
    }
  };

  const handleSectionCancel = (section) => {
    setFormData(patientData);
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className={styles.avatarImage} />
            ) : (
              <span>{avatar}</span>
            )}
            {uploadStatus === 'uploading' && (
              <div className={styles.uploadProgress}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {editingSections.personal ? (
            <div className={styles.avatarActions}>
              <button 
                onClick={handleUploadClick}
                className={styles.avatarUploadBtn}
              >
                <FaCamera /> {avatarPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
              {avatarPreview && (
                <button 
                  onClick={handleRemoveAvatar}
                  className={styles.avatarRemoveBtn}
                >
                  <FaTrash /> Remove
                </button>
              )}
              {uploadStatus === 'error' && (
                <div className={styles.uploadError}>
                  Please select a valid image (max 2MB)
                </div>
              )}
            </div>
          ) : (
            <h2>{`${patientData.firstName} ${patientData.lastName}`}</h2>
          )}
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileSections}>
          {/* Personal Information Section */}
          <section className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Personal Information</h3>
              <div className={styles.sectionBadge}>Basic Details</div>
              {!editingSections.personal ? (
                <button 
                  onClick={() => handleSectionEdit('personal')}
                  className={styles.sectionEditBtn}
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <div className={styles.sectionActions}>
                  <button 
                    onClick={() => handleSectionSave('personal')}
                    className={styles.sectionSaveBtn}
                  >
                    <FaSave /> Save
                  </button>
                  <button 
                    onClick={() => handleSectionCancel('personal')}
                    className={styles.sectionCancelBtn}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaUser /> Full Name
                  </div>
                  {editingSections.personal ? (
                    <div className={styles.nameInputs}>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                      />
                    </div>
                  ) : (
                    <div className={styles.infoValue}>
                      {`${patientData.firstName} ${patientData.lastName}`}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaEnvelope /> Email
                  </div>
                  {editingSections.personal ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.email}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaPhone /> Phone Number
                  </div>
                  {editingSections.personal ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.phone}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaMapMarkerAlt /> Address
                  </div>
                  {editingSections.personal ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.address}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaBirthdayCake /> Date of Birth
                  </div>
                  {editingSections.personal ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {new Date(patientData.dob).toLocaleDateString()} (Age {calculateAge(patientData.dob)})
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaVenusMars /> Gender
                  </div>
                  {editingSections.personal ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Medical Information Section */}
          <section className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Medical Information</h3>
              <div className={styles.sectionBadge}>Health Details</div>
              {!editingSections.medical ? (
                <button 
                  onClick={() => handleSectionEdit('medical')}
                  className={styles.sectionEditBtn}
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <div className={styles.sectionActions}>
                  <button 
                    onClick={() => handleSectionSave('medical')}
                    className={styles.sectionSaveBtn}
                  >
                    <FaSave /> Save
                  </button>
                  <button 
                    onClick={() => handleSectionCancel('medical')}
                    className={styles.sectionCancelBtn}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaIdCard /> Blood Type
                  </div>
                  {editingSections.medical ? (
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.bloodType}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaIdCard /> Insurance ID
                  </div>
                  {editingSections.medical ? (
                    <input
                      type="text"
                      name="insuranceId"
                      value={formData.insuranceId}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.insuranceId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Contact Section */}
          <section className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Emergency Contact</h3>
              <div className={styles.sectionBadge}>Safety</div>
              {!editingSections.emergency ? (
                <button 
                  onClick={() => handleSectionEdit('emergency')}
                  className={styles.sectionEditBtn}
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <div className={styles.sectionActions}>
                  <button 
                    onClick={() => handleSectionSave('emergency')}
                    className={styles.sectionSaveBtn}
                  >
                    <FaSave /> Save
                  </button>
                  <button 
                    onClick={() => handleSectionCancel('emergency')}
                    className={styles.sectionCancelBtn}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaUser /> Contact Name
                  </div>
                  {editingSections.emergency ? (
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.emergencyContact.name}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaPhone /> Contact Phone
                  </div>
                  {editingSections.emergency ? (
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.emergencyContact.phone}
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaUser /> Relationship
                  </div>
                  {editingSections.emergency ? (
                    <input
                      type="text"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      className={styles.inputField}
                    />
                  ) : (
                    <div className={styles.infoValue}>
                      {patientData.emergencyContact.relationship}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;