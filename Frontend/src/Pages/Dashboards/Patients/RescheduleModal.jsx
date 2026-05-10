import React, { useState, useEffect } from 'react';
import { 
  FiX, FiCalendar, FiClock, FiUser, FiMapPin, FiInfo,
  FiChevronLeft, FiChevronRight, FiCheck, FiArrowRight,
  FiMessageSquare, FiShield, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const RescheduleModal = ({ 
  isOpen, 
  onClose, 
  appointment,
  onReschedule
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        const slots = generateMockSlots(currentMonth);
        setAvailableSlots(slots);
        setIsLoading(false);
      }, 800);
    }
  }, [isOpen, currentMonth]);

  const generateMockSlots = (month) => {
    const slots = {};
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        slots[date.toISOString().split('T')[0]] = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'];
      }
    }
    return slots;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onReschedule(selectedDate.toISOString().split('T')[0], selectedTime);
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
          {hasSlots && !isSelected && <span className="absolute bottom-2 h-1 w-1 bg-amber-500 rounded-full" />}
          {isToday && !isSelected && <span className="absolute top-2 text-[8px] font-black uppercase text-amber-500">Today</span>}
        </motion.button>
      );
    }
    return days;
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'New Date', icon: <FiCalendar /> },
    { id: 2, label: 'New Time', icon: <FiClock /> },
    { id: 3, label: 'Confirm', icon: <FiCheck /> }
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
          className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar - Context Panel */}
          <div className="w-full md:w-[320px] bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-slate-100">
                  <FiRefreshCw size={20} className="animate-spin-slow" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Reschedule</h2>
              </div>

              <div className="space-y-6">
                {/* Original Appointment Card */}
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <FiAlertCircle size={60} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Original Schedule</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{appointment?.doctor?.startsWith('Dr.') ? appointment.doctor : `Dr. ${appointment?.doctor || 'Robert Chen'}`}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{appointment?.specialty || 'Cardiology'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} className="text-slate-400" />
                      <span>{appointment?.date ? new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'May 12'}</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                      <FiClock size={14} className="text-slate-400" />
                      <span>{appointment?.time || '10:30 AM'}</span>
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
                        {step > s.id ? <FiCheck size={14} /> : s.id}
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
              <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-3 border border-amber-100">
                <FiInfo size={18} className="text-amber-600 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-600 leading-relaxed">
                  Rescheduling is free if done 24 hours before the original time. Late changes may incur a small processing fee.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 md:p-12 flex flex-col relative bg-white font-manrope">
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
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Change Date</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Select your new preferred date</p>
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
                      <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
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
                          onClick={() => { setSelectedTime(time); setStep(3); }}
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
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Final Review</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Confirm your new schedule</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-5 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 shadow-sm relative overflow-hidden group">
                        <FiCheck className="absolute -right-4 -bottom-4 text-amber-500/10 text-8xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                          <FiCheck size={28} />
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">New Appointment Time</p>
                          <p className="text-lg font-black text-slate-900">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedTime}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute top-4 left-4 text-slate-400">
                          <FiMessageSquare size={18} />
                        </div>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Reason for rescheduling (optional)..."
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-600 focus:ring-4 focus:ring-amber-500/5 outline-none h-32 resize-none transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          Confirm Changes
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
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

export default RescheduleModal;