import React, { useState } from 'react';
import { 
  FiX, FiCalendar, FiClock, FiUser, FiAlertCircle, 
  FiEdit2, FiTrash2, FiCheckCircle, FiFileText 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RescheduleModal from './RescheduleModal';

const AppointmentViewModal = ({ 
  appointment, 
  onClose, 
  onCancel, 
  onReschedule,
  onEditNotes
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(appointment?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const handleSaveNotes = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onEditNotes(appointment.id, editedNotes);
      setIsEditingNotes(false);
      setIsSubmitting(false);
    }, 800);
  };

  const handleRescheduleSubmit = (date, time) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onReschedule(appointment.id, date, time);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const statusColors = {
    confirmed: 'bg-secondary/10 text-secondary',
    pending: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-error/10 text-error'
  };

  return (
    <AnimatePresence>
      {appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <FiCalendar className="text-secondary text-lg" />
                </div>
                <h2 className="text-[17px] font-bold text-slate-900 font-h2">Appointment Details</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600 hover:shadow-sm"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Appointment Info */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{appointment.title}</h3>
                  <p className="text-[13px] text-slate-500 font-medium">{appointment.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${statusColors[appointment.status] || 'bg-slate-100 text-slate-500'}`}>
                  {appointment.status}
                </span>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-secondary transition-colors shadow-sm">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-[14px] font-semibold text-slate-700">{appointment.date}</p>
                  </div>
                </div>
                
                <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-secondary transition-colors shadow-sm">
                    <FiClock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                    <p className="text-[14px] font-semibold text-slate-700">{appointment.time}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-secondary transition-colors shadow-sm">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor</p>
                    <p className="text-[14px] font-semibold text-slate-700">{appointment.doctor}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-secondary transition-colors shadow-sm">
                    <FiAlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                    <p className="text-[14px] font-semibold text-slate-700 capitalize">{appointment.status}</p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-slate-400" />
                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
                  </div>
                  {!isEditingNotes && appointment.status !== 'cancelled' && (
                    <button 
                      onClick={() => setIsEditingNotes(true)}
                      className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                    >
                      <FiEdit2 size={12} /> Edit
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Enter notes about this appointment..."
                      rows="3"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-600 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes(appointment.notes);
                        }}
                        className="px-4 py-1.5 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveNotes}
                        className="px-4 py-1.5 bg-secondary text-white text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <p className="text-[13px] text-slate-600 leading-relaxed italic">
                      "{appointment.notes || 'No additional notes provided.'}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between gap-3">
              {appointment.status !== 'cancelled' ? (
                <>
                  <button 
                    onClick={() => onCancel(appointment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-error border border-error/10 text-[13px] font-bold rounded-2xl shadow-sm hover:bg-error/5 transition-all active:scale-95"
                    disabled={isSubmitting}
                  >
                    <FiTrash2 size={16} /> Cancel Appointment
                  </button>
                  <button 
                    onClick={() => setShowRescheduleModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-[13px] font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
                    disabled={isSubmitting}
                  >
                    <FiEdit2 size={16} /> Reschedule
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-2 text-slate-400 text-sm font-medium italic">
                  This appointment has been cancelled.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        appointment={appointment}
        onReschedule={handleRescheduleSubmit}
      />
    </AnimatePresence>
  );
};

export default AppointmentViewModal;