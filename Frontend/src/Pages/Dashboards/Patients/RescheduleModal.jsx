import React, { useState, useEffect } from 'react';
import { 
  FiX, FiCalendar, FiClock, FiUser, FiMapPin, FiInfo,
  FiChevronLeft, FiChevronRight, FiCheck
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
        slots[date.toISOString().split('T')[0]] = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM'];
      }
    }
    return slots;
  };

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <FiChevronLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900">Reschedule Visit</h2>
                <p className="text-[12px] text-slate-400 font-medium">Step {step} of 3</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
              <FiX size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {step === 1 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-slate-900 capitalize">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><FiChevronLeft /></button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><FiChevronRight /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-300 py-2">{d}</div>)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    const hasSlots = date.getDay() !== 0 && date.getDay() !== 6;
                    return (
                      <button
                        key={i}
                        disabled={!hasSlots}
                        onClick={() => handleDateSelect(date)}
                        className={`aspect-square rounded-xl text-[13px] font-semibold flex items-center justify-center transition-all ${
                          isSelected ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 
                          hasSlots ? 'hover:bg-secondary/5 text-slate-600' : 'text-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <FiCalendar className="text-secondary" />
                  <p className="text-sm font-bold text-slate-700">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM'].map(time => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); setStep(3); }}
                      className={`py-4 rounded-2xl text-sm font-bold transition-all border ${
                        selectedTime === time ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/30' : 'bg-white border-slate-100 text-slate-600 hover:border-secondary/30 hover:bg-secondary/5'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10 text-secondary">
                    <FiCheck size={24} className="flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">Confirm New Schedule</p>
                      <p className="text-[15px] font-bold">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedTime}</p>
                    </div>
                  </div>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Add a note (optional)..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-600 focus:ring-2 focus:ring-secondary/20 outline-none h-32 resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Confirm Reschedule'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RescheduleModal;