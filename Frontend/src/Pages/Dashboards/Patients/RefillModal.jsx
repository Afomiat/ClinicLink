import React, { useState } from 'react';
import { 
  FiX, FiActivity, FiCheck, FiUser, FiSend, 
  FiChevronLeft, FiChevronRight, FiClock, FiAlertCircle,
  FiCheckCircle, FiShield, FiArrowRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const RefillModal = ({ isOpen, onClose, prescriptions = [] }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [urgency, setUrgency] = useState('routine');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsLoading(false);
    setStep(3);
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Medication', icon: <FiActivity /> },
    { id: 2, label: 'Details', icon: <FiClock /> },
    { id: 3, label: 'Success', icon: <FiCheckCircle /> }
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
          {/* Sidebar - Context Panel */}
          <div className="w-full md:w-[320px] bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-slate-100">
                  <FiActivity size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Refill Hub</h2>
              </div>

              <div className="space-y-6">
                {/* Medication Context Card */}
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <FiActivity size={60} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Medication Context</p>
                  
                  {selectedPrescription ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <FiActivity size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">{selectedPrescription.medication}</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{selectedPrescription.dosage}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/50 p-2 rounded-xl">
                          <FiUser size={14} className="text-purple-500" />
                          <span>Dr. {selectedPrescription.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/50 p-2 rounded-xl">
                          <FiAlertCircle size={14} className="text-amber-500" />
                          <span>Expires: {new Date(selectedPrescription.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-8 text-center">
                      <FiActivity size={32} className="mx-auto text-slate-200 mb-2" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select a med to start</p>
                    </div>
                  )}
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
              <div className="p-4 bg-purple-50 rounded-2xl flex items-start gap-3 border border-purple-100">
                <FiShield size={18} className="text-purple-600 mt-0.5" />
                <p className="text-[10px] font-bold text-purple-600 leading-relaxed">
                  Refill requests are reviewed by your doctor. You'll be notified once approved or if a follow-up is needed.
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
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
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
                          <h3 className="text-3xl font-black text-slate-900 mb-2">Select Med</h3>
                          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Which prescription needs a refill?</p>
                        </div>

                        <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {prescriptions.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => { setSelectedPrescription(p); setStep(2); }}
                              className={`flex items-center justify-between p-5 rounded-3xl border transition-all text-left ${
                                selectedPrescription?.id === p.id 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
                                : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <h4 className="text-sm font-black">{p.medication}</h4>
                                <p className={`text-[10px] font-bold uppercase ${selectedPrescription?.id === p.id ? 'text-slate-400' : 'text-slate-400'}`}>{p.dosage}</p>
                              </div>
                              <FiChevronRight size={20} className={selectedPrescription?.id === p.id ? 'text-white' : 'text-slate-300'} />
                            </button>
                          ))}
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
                          <h3 className="text-3xl font-black text-slate-900 mb-2">Request Details</h3>
                          <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest">
                            <FiActivity size={14} />
                            Refilling {selectedPrescription.medication}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Urgency Level</p>
                            <div className="grid grid-cols-2 gap-3">
                              {['routine', 'urgent'].map((u) => (
                                <button
                                  key={u}
                                  type="button"
                                  onClick={() => setUrgency(u)}
                                  className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${
                                    urgency === u ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span className="text-xs font-black uppercase tracking-widest">{u}</span>
                                  <span className="text-[8px] font-bold opacity-60">
                                    {u === 'routine' ? 'Within 5 days' : 'Within 48 hours'}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="relative">
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Message to doctor (optional)..."
                              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-600 focus:ring-4 focus:ring-purple-500/5 outline-none h-32 resize-none transition-all shadow-inner"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                          >
                            {isLoading ? 'Sending...' : (
                              <>
                                Send Request
                                <FiSend />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8"
                >
                  <div className="h-24 w-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <FiCheckCircle size={48} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Request Sent!</h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Pending Doctor Approval</p>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] p-8 text-left space-y-4 shadow-inner">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication</p>
                      <p className="text-sm font-black text-slate-900">{selectedPrescription.medication}</p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgency</p>
                      <p className="text-xs font-black text-purple-600 uppercase">{urgency}</p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Completion</p>
                      <p className="text-xs font-black text-slate-900">{urgency === 'routine' ? '5 Business Days' : '48 Hours'}</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    Done
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RefillModal;