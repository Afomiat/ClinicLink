import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, FiCalendar, FiClock, FiUser, FiMapPin, FiInfo,
  FiChevronLeft, FiChevronRight, FiCreditCard, FiLock,
  FiUploadCloud, FiCheckCircle, FiTrash2, FiFileText,
  FiArrowRight, FiShield, FiDollarSign, FiPlus
} from 'react-icons/fi';
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
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        slots[date.toISOString().split('T')[0]] = [
          '09:00 AM', '10:30 AM', '11:00 AM',
          '01:00 PM', '02:30 PM', '03:00 PM'
        ];
      }
    }
    return slots;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(3.5);
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
    }, 150);

    setTimeout(() => {
      setPaymentProof({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      });
      clearInterval(interval);
      setIsUploading(false);
    }, 1800);
  };

  const removePaymentProof = () => {
    if (paymentProof?.preview) URL.revokeObjectURL(paymentProof.preview);
    setPaymentProof(null);
    setUploadProgress(0);
  };

  const verifyPaymentProof = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(4);
    setIsLoading(false);
  };

  const handleConfirmAppointment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newApt = {
      id: `APP-${Date.now()}`,
      doctor: doctor?.name || 'Dr. Sarah Mitchell',
      specialty: doctor?.specialty || 'General Practice',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'confirmed',
      notes: reason
    };
    onSchedule(newApt);
    setIsLoading(false);
    onClose();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const hasSlots = availableSlots[dateStr]?.length > 0;
      const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
      const isToday = date.toDateString() === new Date().toDateString();
      days.push(
        <motion.button
          key={i}
          whileHover={{ scale: hasSlots ? 1.05 : 1 }}
          whileTap={{ scale: hasSlots ? 0.95 : 1 }}
          onClick={() => hasSlots && handleDateSelect(date)}
          className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all ${
            isSelected ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 
            hasSlots ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100' : 'text-slate-200 cursor-not-allowed opacity-40'
          }`}
        >
          <span className="text-sm font-black">{i}</span>
          {hasSlots && !isSelected && <span className="absolute bottom-2 h-1 w-1 bg-primary rounded-full" />}
          {isToday && !isSelected && <span className="absolute top-2 text-[8px] font-black uppercase text-primary">Today</span>}
        </motion.button>
      );
    }
    return days;
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Date', icon: <FiCalendar /> },
    { id: 2, label: 'Time', icon: <FiClock /> },
    { id: 3, label: 'Payment', icon: <FiCreditCard /> },
    { id: 4, label: 'Confirm', icon: <FiCheckCircle /> }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[600px] font-manrope"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Info - Matching Reschedule Layout */}
          <div className="w-full md:w-[320px] bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                  <FiPlus size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">New Booking</h2>
              </div>

              <div className="space-y-6">
                {/* Specialist Profile Card */}
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <FiUser size={60} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Selected Specialist</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                      <img src={doctor?.image || 'https://randomuser.me/api/portraits/women/65.jpg'} alt="Doctor" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{doctor?.name?.startsWith('Dr.') ? doctor.name : `Dr. ${doctor?.name || 'Sarah Mitchell'}`}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{doctor?.specialty || 'General Practice'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/50 p-2 rounded-xl">
                      <FiMapPin size={14} className="text-primary" />
                      <span className="truncate">{doctor?.contact?.address || 'Medical Plaza, NY'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/50 p-2 rounded-xl">
                      <FiDollarSign size={14} className="text-secondary" />
                      <span>Consultation: ETB 750.00</span>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="space-y-3">
                  {steps.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        step >= s.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-300 border border-slate-100'
                      }`}>
                        {step > s.id ? <FiCheckCircle size={14} /> : s.id}
                      </div>
                      <p className={`text-xs font-black uppercase tracking-widest ${
                        step >= s.id ? 'text-slate-900' : 'text-slate-300'
                      }`}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div className="p-4 bg-primary/5 rounded-2xl flex items-start gap-3 border border-primary/10">
                <FiShield size={18} className="text-primary mt-0.5" />
                <p className="text-[10px] font-bold text-primary leading-relaxed opacity-80">
                  Your medical data is encrypted and secure. We follow strict HIPAA guidelines for patient privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 md:p-12 flex flex-col relative bg-white">
            <button 
              onClick={onClose} 
              className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="flex-1 flex flex-col justify-center max-w-[500px] mx-auto w-full">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Pick a Date</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">When would you like to visit?</p>
                    </div>

                    <div className="bg-white">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h4>
                        <div className="flex gap-2">
                          <button onClick={handlePrevMonth} className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"><FiChevronLeft /></button>
                          <button onClick={handleNextMonth} className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"><FiChevronRight /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                          <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">{d}</div>
                        ))}
                        {renderCalendar()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Select Time</h3>
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                        <FiCalendar size={14} />
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots[selectedDate.toISOString().split('T')[0]]?.map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTimeSelect(time)}
                          className={`py-5 rounded-3xl text-sm font-black transition-all border ${
                            selectedTime === time ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>

                    <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
                      <FiChevronLeft /> Change Date
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Payment</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Secure Checkout</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {['telebirr', 'cbe'].map((m) => (
                          <button
                            key={m}
                            onClick={() => setPaymentMethod(m)}
                            className={`flex items-center gap-3 p-4 rounded-3xl border transition-all ${
                              paymentMethod === m ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border-slate-100 text-slate-600'
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${paymentMethod === m ? 'bg-white/20' : 'bg-slate-50'}`}>
                              <FiCreditCard size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{m}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Instructions</h4>
                        <ol className="space-y-3 text-[11px] font-bold text-slate-600 list-decimal pl-4">
                          <li>Open your {paymentMethod.toUpperCase()} app</li>
                          <li>Go to "Pay Bill" or "Transfer"</li>
                          <li>Enter ID: <span className="font-black text-slate-900">HEALTH77</span></li>
                          <li>Reference: <span className="font-black text-slate-900">DOC-552</span></li>
                          <li>Amount: <span className="font-black text-slate-900">ETB 750.00</span></li>
                        </ol>
                      </div>

                      <button
                        onClick={handlePaymentSubmit}
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95 disabled:opacity-50"
                      >
                        {isLoading ? 'Processing...' : 'I have paid'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3.5 && (
                  <motion.div 
                    key="step3.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Upload Proof</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Transaction Confirmation</p>
                    </div>

                    {!paymentProof ? (
                      <div 
                        onClick={() => fileInputRef.current.click()}
                        className="border-4 border-dashed border-slate-50 bg-slate-50/50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all group"
                      >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          <FiUploadCloud size={32} />
                        </div>
                        <p className="text-sm font-black text-slate-900 mb-1">Click to upload</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Screenshot or Receipt (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="p-6 bg-white rounded-[2rem] border-2 border-primary/20 shadow-xl shadow-primary/5 relative group">
                        <button onClick={removePaymentProof} className="absolute -top-2 -right-2 h-8 w-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100">
                          <FiTrash2 size={14} />
                        </button>
                        <div className="flex items-center gap-4">
                          {paymentProof.preview ? (
                            <img src={paymentProof.preview} className="h-16 w-16 rounded-2xl object-cover shadow-sm" alt="Preview" />
                          ) : (
                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><FiFileText size={24} /></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 truncate">{paymentProof.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paymentProof.size}</p>
                          </div>
                          <FiCheckCircle size={24} className="text-secondary" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={verifyPaymentProof}
                      disabled={!paymentProof || isLoading}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Submit Verification'}
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <div className="h-20 w-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={40} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">All Set!</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Ready to confirm booking</p>
                    </div>

                    <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 shadow-inner">
                      <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                        <p className="text-sm font-black text-slate-900">{doctor?.name || 'Dr. Sarah Mitchell'}</p>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">{selectedTime}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <textarea
                          placeholder="Add a note for the doctor..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none h-24 shadow-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmAppointment}
                      disabled={isLoading}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? 'Finalizing...' : 'Finalize Appointment'}
                        {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleAppointmentModal;