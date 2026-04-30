import React, { useState, useEffect, useRef } from 'react';

import styles from './ScheduleAppointmentModal.module.css';
import { 
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaLock,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTrashAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleAppointmentModal = ({ 
  isOpen = false, 
  onClose = () => {},
  doctor = {},
  onSchedule = () => {}
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
 const [paymentProof, setPaymentProof] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        const slots = generateMockSlots(currentMonth);
        setAvailableSlots(slots || {});
        setIsLoading(false);
      }, 800);
    }
  }, [isOpen, currentMonth]);

  const generateMockSlots = (month) => {
    if (!month) return {};
    
    const slots = {};
    const daysInMonth = new Date(
      month.getFullYear(), 
      month.getMonth() + 1, 
      0
    ).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      if (date && date.getDay() !== 0 && date.getDay() !== 6) {
        slots[date.toISOString().split('T')[0]] = [
          '9:00 AM', '10:30 AM', '11:00 AM',
          '1:00 PM', '2:30 PM', '3:00 PM'
        ];
      }
    }
    return slots;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ));
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime('');
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    if (!time) return;
    setSelectedTime(time);
    setStep(3);
  };

  const handlePaymentSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Move to payment proof step instead of confirmation
    setStep(3.5); // New step for payment proof
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, GIF) or PDF file');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should not exceed 5MB');
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // For demo purposes, we'll just store the file object
    setTimeout(() => {
      setPaymentProof({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      });
      clearInterval(interval);
      setIsUploading(false);
    }, 2000);
  };

  const removePaymentProof = () => {
    if (paymentProof?.preview) {
      URL.revokeObjectURL(paymentProof.preview);
    }
    setPaymentProof(null);
    setUploadProgress(0);
  };

  const verifyPaymentProof = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(4); // Move to confirmation
    setIsLoading(false);
  };

  const handleConfirmAppointment = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment = {
      id: `APP-${Date.now()}`,
      doctor: doctor?.name || 'Unknown Doctor',
      specialty: doctor?.specialty || 'General',
      date: selectedDate?.toISOString() || new Date().toISOString(),
      time: selectedTime || 'Not specified',
      status: 'Confirmed',
      location: doctor?.contact?.address || 'Not specified',
      notes: reason,
      payment: {
        method: paymentMethod,
        amount: 75.00,
        status: 'Completed'
      }
    };
    
    onSchedule(newAppointment);
    setIsLoading(false);
    onClose();
  };

  const handleCardInputChange = (e) => {
    if (!e?.target) return;
    
    const { name, value } = e.target;
    
    if (name === 'number') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    if (name === 'expiry') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const renderCalendar = () => {
    if (!currentMonth) return null;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`prev-${i}`} className={styles.calendarDayEmpty}></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date?.toISOString()?.split('T')[0] || '';
      const hasSlots = availableSlots[dateString]?.length > 0;
      const isSelected = selectedDate?.toISOString()?.split('T')[0] === dateString;
      const isToday = date?.toDateString() === new Date().toDateString();
      
      days.push(
        <motion.div
          key={`day-${i}`}
          className={`
            ${styles.calendarDay} 
            ${hasSlots ? styles.available : styles.unavailable}
            ${isSelected ? styles.selected : ''}
            ${isToday ? styles.today : ''}
          `}
          whileHover={{ scale: hasSlots ? 1.05 : 1 }}
          whileTap={{ scale: hasSlots ? 0.95 : 1 }}
          onClick={() => hasSlots && handleDateSelect(date)}
        >
          <span className={styles.dayNumber}>{i}</span>
          {hasSlots && (
            <span className={styles.slotIndicator}>
              {availableSlots[dateString]?.length || 0} slots
            </span>
          )}
          {isToday && <span className={styles.todayBadge}>Today</span>}
        </motion.div>
      );
    }
    
    return days;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className={styles.modalHeader}>
            {step > 1 && (
              <button 
                className={styles.backButton}
                onClick={() => setStep(step - 1)}
                aria-label="Go back"
              >
                <FaChevronLeft />
              </button>
            )}
            <div className={styles.headerContent}>
              <h2>Schedule Appointment</h2>
              <p className={styles.subtitle}>
                {step === 1 && 'Select a date for your appointment'}
                {step === 2 && 'Select a time for your appointment'}
                {step === 3 && 'Enter payment details'}
                {step === 4 && 'Confirm your appointment'}
              </p>
            </div>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.appointmentCard}>
              <div className={styles.doctorInfo}>
                <div className={styles.avatar}>
                  <img 
                    src={doctor?.image || '/default-doctor.png'} 
                    alt={doctor?.name || "Doctor"} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-doctor.png';
                    }}
                  />
                </div>
                <div>
                  <h3>
                    <FaUserMd /> {doctor?.name || 'No doctor selected'}
                  </h3>
                  <p className={styles.specialty}>{doctor?.specialty || 'Specialty not available'}</p>
                </div>
              </div>
              
              <div className={styles.appointmentMeta}>
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt />
                  <span>{doctor?.contact?.address || 'Address not available'}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaInfoCircle />
                  <span>Consultation Fee: $75.00</span>
                </div>
              </div>
            </div>

            <div className={styles.progressSteps}>
              <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                <span>1</span>
                <p>Select Date</p>
              </div>
              <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                <span>2</span>
                <p>Select Time</p>
              </div>
              <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <p>Payment</p>
              </div>
              <div className={`${styles.step} ${step >= 4 ? styles.active : ''}`}>
                <span>4</span>
                <p>Confirm</p>
              </div>
            </div>

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={styles.dateSelection}
              >
                <div className={styles.calendarHeader}>
                  <button 
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    disabled={isLoading}
                  >
                    <FaChevronLeft />
                  </button>
                  <h3 className={styles.monthTitle}>
                    {currentMonth?.toLocaleString('default', { month: 'long' })} {currentMonth?.getFullYear()}
                  </h3>
                  <button 
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    disabled={isLoading}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                
                <div className={styles.calendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.dayHeader}>{day}</div>
                  ))}
                  
                  {isLoading ? (
                    <div className={styles.loadingCalendar}>
                      <div className={styles.loadingSpinner}></div>
                      <p>Loading available dates...</p>
                    </div>
                  ) : (
                    renderCalendar()
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={styles.timeSelection}
              >
                <div className={styles.selectedDate}>
                  <FaCalendarAlt />
                  <h3>
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <button 
                    className={styles.textBackButton}
                    onClick={() => setStep(1)}
                  >
                    Change date
                  </button>
                </div>
                
                <div className={styles.timeSlotsGrid}>
                  {availableSlots[selectedDate?.toISOString()?.split('T')[0]]?.map(time => (
                    <motion.button
                      key={time}
                      type="button"
                      className={`${styles.timeSlot} ${
                        selectedTime === time ? styles.selected : ''
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={styles.paymentStep}
              >
                <div className={styles.paymentMethods}>
                  <h3>Payment Method</h3>
                  <div className={styles.methodOptions}>
                    <button
                      type="button"
                      className={`${styles.methodOption} ${paymentMethod === 'telebirr' ? styles.active : ''}`}
                      onClick={() => setPaymentMethod('telebirr')}
                    >
                      <img 
                        src="/assets/telebirr.svg" 
                        alt="Telebirr" 
                        className={styles.paymentIcon}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-payment.svg';
                        }}
                      />
                      Telebirr
                    </button>
                    <button
                      type="button"
                      className={`${styles.methodOption} ${paymentMethod === 'cbe' ? styles.active : ''}`}
                      onClick={() => setPaymentMethod('cbe')}
                    >
                      <img 
                        src="/assets/cbe-birr.svg" 
                        alt="CBE Birr" 
                        className={styles.paymentIcon}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-payment.svg';
                        }}
                      />
                      CBE Birr
                    </button>
                  </div>
                </div>

                {paymentMethod === 'telebirr' && (
                  <div className={styles.localPayment}>
                    <div className={styles.paymentInstructions}>
                      <h4>Pay with Telebirr</h4>
                      <ol>
                        <li>Open your Telebirr mobile app</li>
                        <li>Go to <strong>Pay Bill</strong> section</li>
                        <li>Enter Biller ID: <strong>HEALTH123</strong></li>
                        <li>Enter Reference: <strong>DOC-{doctor?.id || '000'}</strong></li>
                        <li>Enter Amount: <strong>ETB 77.50</strong></li>
                        <li>Complete your payment</li>
                      </ol>
                    </div>
                    
                    <div className={styles.paymentSummary}>
                      <div className={styles.summaryItem}>
                        <span>Consultation Fee</span>
                        <span>ETB 75.00</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span>Service Fee</span>
                        <span>ETB 2.50</span>
                      </div>
                      <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>ETB 77.50</span>
                      </div>
                    </div>
                    
                    <div className={styles.securityNote}>
                      <FaLock /> Your payment is secure and encrypted
                    </div>
                    
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className={styles.buttonLoading}>
                          <span className={styles.spinner}></span>
                          Verifying Payment...
                        </span>
                      ) : (
                        'I Have Completed Payment'
                      )}
                    </button>
                  </div>
                )}
                
                {paymentMethod === 'cbe' && (
                  <div className={styles.localPayment}>
                    <div className={styles.paymentInstructions}>
                      <h4>Pay with CBE Birr</h4>
                      <ol>
                        <li>Open your CBE Birr mobile app</li>
                        <li>Go to <strong>Payments</strong> section</li>
                        <li>Select <strong>Health Services</strong></li>
                        <li>Enter Provider: <strong>HealthConnect</strong></li>
                        <li>Enter Reference: <strong>DOC-{doctor?.id || '000'}</strong></li>
                        <li>Enter Amount: <strong>ETB 77.50</strong></li>
                        <li>Complete your payment</li>
                      </ol>
                      <p className={styles.note}>
                        You can also pay at any CBE branch using the reference above.
                      </p>
                    </div>
                    
                    <div className={styles.paymentSummary}>
                      <div className={styles.summaryItem}>
                        <span>Consultation Fee</span>
                        <span>ETB 75.00</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span>Service Fee</span>
                        <span>ETB 2.50</span>
                      </div>
                      <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>ETB 77.50</span>
                      </div>
                    </div>
                    
                    <div className={styles.securityNote}>
                      <FaLock /> Your payment is secure and encrypted
                    </div>
                    
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className={styles.buttonLoading}>
                          <span className={styles.spinner}></span>
                          Verifying Payment...
                        </span>
                      ) : (
                        'I Have Completed Payment'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

                      {/* NEW STEP: Payment Proof Upload */}
          {step === 3.5 && (
            <motion.div
              key="step3.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={styles.paymentProofStep}
            >
              <div className={styles.paymentProofHeader}>
                <h3>Upload Payment Proof</h3>
              </div>

              <div className={styles.uploadContainer}>
                {!paymentProof ? (
                  <div 
                    className={styles.uploadArea}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                    />
                    <div className={styles.uploadContent}>
                      <FaCloudUploadAlt className={styles.uploadIcon} />
                      <p className={styles.uploadText}>Click to browse</p>
                      <p className={styles.uploadSubtext}>JPEG, PNG, GIF or PDF (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadPreview}>
                    {paymentProof.preview ? (
                      <div className={styles.imagePreview}>
                        <img src={paymentProof.preview} alt="Payment proof" />
                        <button 
                          className={styles.removeButton}
                          onClick={removePaymentProof}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.filePreview}>
                        <div className={styles.fileInfo}>
                          <FaFileAlt className={styles.fileIcon} />
                          <div>
                            <p className={styles.fileName}>{paymentProof.name}</p>
                            <p className={styles.fileSize}>{paymentProof.size}</p>
                          </div>
                        </div>
                        <button 
                          className={styles.removeButton}
                          onClick={removePaymentProof}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isUploading && (
                  <div className={styles.uploadProgress}>
                    <div 
                      className={styles.progressBar}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}

                {paymentProof && !isUploading && (
                  <div className={styles.uploadSuccess}>
                    <FaCheckCircle className={styles.successIcon} />
                    <span>File uploaded successfully</span>
                  </div>
                )}
              </div>

              <div className={styles.uploadInstructions}>
                <h4>How to take a good screenshot:</h4>
                <ul>
                  <li>Make sure the transaction ID and amount are visible</li>
                  <li>Capture the entire confirmation screen</li>
                  <li>Ensure the image is clear and readable</li>
                  <li>Check that the date/time is visible</li>
                </ul>
              </div>
                <div className={styles.proofActionButtons}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setStep(3)}
                  >
                    <FaChevronLeft className={`${styles.backIcon} backIcon`} />
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={verifyPaymentProof}
                    disabled={!paymentProof || isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.buttonLoading}>
                        <span className={styles.spinner}></span>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify Payment
                        <FaCheckCircle className={`${styles.verifyIcon} verifyIcon`} />
                      </>
                    )}
                  </button>
                </div>
            </motion.div>
          )}


            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={styles.confirmationStep}
              >
                <div className={styles.successCheckmark}>
                  <div className={styles.checkIcon}>
                    <span className={styles.iconLine + ' ' + styles.lineTip}></span>
                    <span className={styles.iconLine + ' ' + styles.lineLong}></span>
                    <div className={styles.iconCircle}></div>
                    <div className={styles.iconFix}></div>
                  </div>
                </div>
                
                <h3 className={styles.successTitle}>Payment Successful!</h3>
                <p className={styles.successMessage}>Your appointment has been scheduled and payment processed.</p>
                
                <div className={styles.confirmationCard}>
                  <div className={styles.detailRow}>
                    <span>Doctor:</span>
                    <span>{doctor?.name || 'Unknown Doctor'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Date:</span>
                    <span>
                      {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Time:</span>
                    <span>{selectedTime || 'Not specified'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Location:</span>
                    <span>{doctor?.contact?.address || 'Not specified'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Payment Method:</span>
                    <span>
                      {paymentMethod === 'telebirr' ? 'Telebirr' : 
                       paymentMethod === 'cbe' ? 'CBE Birr' : 'Unknown'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Amount Paid:</span>
                    <span>ETB 77.50</span>
                  </div>
                </div>
                
                <div className={styles.reasonInput}>
                  <label>
                    <FaInfoCircle /> Additional Notes (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e?.target?.value || '')}
                    placeholder="Any special requests or information for the doctor..."
                    rows={3}
                  />
                </div>
                
                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleConfirmAppointment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.buttonLoading}>
                        <span className={styles.spinner}></span>
                        Confirming...
                      </span>
                    ) : (
                      'Confirm Appointment'
                    )}
                  </button>
                </div>
              </motion.div>
            )}

                          {/* {paymentProof && (
                <div className={styles.paymentProofConfirmation}>
                  <h4>Payment Proof:</h4>
                  {paymentProof.preview ? (
                    <div className={styles.proofImageContainer}>
                      <img 
                        src={paymentProof.preview} 
                        alt="Payment proof" 
                        className={styles.proofImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.proofFileInfo}>
                      <FaFileAlt className={styles.fileIcon} />
                      <span>{paymentProof.name}</span>
                    </div>
                  )}
                </div>
              )} */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleAppointmentModal;