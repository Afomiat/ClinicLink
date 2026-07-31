import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiVideo, FiPhone, FiMessageSquare, FiMic, FiCamera,
  FiClock, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle,
  FiMapPin, FiStar, FiShield, FiSearch, FiDownload, FiPrinter, FiMail, FiDollarSign
} from 'react-icons/fi';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.18 } },
};

const ModalWrapper = ({ onClose, children, maxWidth = 'max-w-lg' }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl overflow-hidden`}
      >
        {children}
      </motion.div>
    </div>
  </AnimatePresence>
);

export const FollowUpRequestsModal = ({ onClose }) => {
  const requests = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', message: 'Please submit your blood pressure readings for the past week.', date: '2 days ago', urgent: true },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Dermatology', message: 'Upload photos of the affected skin area after applying medication.', date: '5 days ago', urgent: false },
  ];

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900">Follow-up Requests</h3>
          <p className="text-sm text-slate-400 mt-0.5">{requests.length} doctors awaiting your response</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <FiX size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {requests.map((req) => (
          <div key={req.id} className={`rounded-2xl border p-4 space-y-3 ${req.urgent ? 'border-red-100 bg-red-50/40' : 'border-slate-100 bg-slate-50/40'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${req.doctor}&background=f1f5f9&color=0f172a&bold=true`} alt={req.doctor} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{req.doctor}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{req.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {req.urgent && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <FiAlertCircle size={9} /> Urgent
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">{req.date}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{req.message}"</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-md">
                Respond Now
              </button>
              <button onClick={onClose} className="px-4 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export const ContactSupportModal = ({ onClose }) => {
  const [form, setForm] = useState({ subject: '', message: '', priority: 'normal' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setSubmitted(true);
  };

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
            <FiMessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Contact Support</h3>
            <p className="text-xs text-slate-400">Available 24/7 for assistance</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <FiX size={18} className="text-slate-500" />
        </button>
      </div>

      {submitted ? (
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 text-secondary"
          >
            <FiCheckCircle size={28} />
          </motion.div>
          <h4 className="text-lg font-black text-slate-900 mb-2">Request Submitted!</h4>
          <p className="text-sm text-slate-500 mb-6">Our support team will reach out within 15 minutes.</p>
          <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:+18005551234" className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-pointer">
              <FiPhone size={18} className="text-slate-900" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Call Us</p>
                <p className="text-xs font-black text-slate-900">1-800-555-1234</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <FiMessageSquare size={18} className="text-slate-900" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Live Chat</p>
                <p className="text-xs font-black text-green-600">Online Now</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Priority</label>
            <div className="flex gap-2">
              {['normal', 'urgent', 'emergency'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`flex-1 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    form.priority === p
                      ? p === 'emergency' ? 'bg-red-600 text-white' : p === 'urgent' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Brief description of issue..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Send Support Request
          </button>
        </form>
      )}
    </ModalWrapper>
  );
};

export const PayAllBalanceModal = ({ onClose, totalAmount = 130, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [status, setStatus] = useState('idle');

  const handlePay = () => {
    if (!paymentMethod) return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      if (onConfirm) onConfirm(paymentMethod);
    }, 2000);
  };

  const methods = [
    { name: 'Telebirr', icon: 'mobile_friendly', color: 'bg-blue-600' },
    { name: 'CBE Birr', icon: 'account_balance', color: 'bg-purple-600' },
    { name: 'Credit Card', icon: 'credit_card', color: 'bg-slate-900' },
  ];

  return (
    <ModalWrapper onClose={status === 'processing' ? undefined : onClose} maxWidth="max-w-md">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h3 className="text-base font-black text-slate-900">Pay All Outstanding Balance</h3>
        {status !== 'processing' && (
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <FiX size={18} className="text-slate-500" />
          </button>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                  <p className="text-xs text-slate-400 mt-1">Full account balance</p>
                </div>
                <span className="text-3xl font-black text-slate-900">${totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3">Payment Method</label>
                <div className="space-y-2">
                  {methods.map(m => (
                    <button
                      key={m.name}
                      onClick={() => setPaymentMethod(m.name)}
                      className={`w-full flex items-center justify-between p-4 border-2 rounded-2xl transition-all cursor-pointer ${paymentMethod === m.name ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 ${m.color} rounded-xl flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-white text-xl">{m.icon}</span>
                        </div>
                        <span className={`font-black ${paymentMethod === m.name ? 'text-slate-900' : 'text-slate-600'}`}>{m.name}</span>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.name ? 'border-slate-900' : 'border-slate-200'}`}>
                        <div className={`h-2.5 w-2.5 rounded-full bg-slate-900 transition-opacity ${paymentMethod === m.name ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!paymentMethod}
                onClick={handlePay}
                className={`w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer ${paymentMethod ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                Pay ${totalAmount.toFixed(2)} Now
              </button>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 text-3xl">lock</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">Processing Payment</h4>
              <p className="text-sm text-slate-500 text-center">Connecting to gateway...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="material-symbols-outlined text-slate-900 text-5xl">check_circle</motion.span>
              </div>
              <h4 className="text-xl font-black text-slate-900">All Paid!</h4>
              <p className="text-sm text-slate-500 text-center">Your outstanding balance has been cleared successfully.</p>
              <button onClick={onClose} className="mt-2 w-full py-4 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
};

export const InvoiceOptionsModal = ({ onClose, invoice, onDownload, onPay }) => {
  const options = [
    { icon: 'receipt', label: 'View Invoice Details', action: () => onClose() },
    { icon: 'download', label: 'Download PDF Receipt', action: () => { onDownload && onDownload(invoice); onClose(); } },
    { icon: 'print', label: 'Print Invoice', action: () => { window.print(); onClose(); } },
    ...(invoice?.status !== 'completed' ? [{ icon: 'payments', label: 'Pay Now', action: () => { onPay && onPay(invoice); onClose(); }, highlight: true }] : []),
    { icon: 'report_problem', label: 'Dispute Invoice', action: () => onClose(), danger: true },
  ];

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-xs">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900">Invoice Options</h3>
          <p className="text-xs text-slate-400">{invoice?.id}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <FiX size={16} className="text-slate-400" />
        </button>
      </div>
      <div className="py-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={opt.action}
            className={`w-full flex items-center gap-4 px-5 py-3.5 transition-all text-left ${
              opt.highlight ? 'bg-slate-900 text-white hover:bg-slate-800' :
              opt.danger ? 'text-red-500 hover:bg-red-50' :
              'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${opt.highlight ? 'text-white' : opt.danger ? 'text-red-400' : 'text-slate-400'}`}>
              {opt.icon}
            </span>
            <span className="text-sm font-bold">{opt.label}</span>
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};

export const ChangePharmacyModal = ({ onClose, onSave }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const pharmacies = [
    { id: 1, name: 'CVS Healthcare Plaza', address: '1234 Healthcare Plaza, Suite 400, New York, NY 10012', phone: '(555) 012-3456', distance: '0.3 mi', rating: 4.8 },
    { id: 2, name: 'Walgreens Medical Center', address: '456 Medical Center Blvd, New York, NY 10013', phone: '(555) 987-6543', distance: '0.7 mi', rating: 4.5 },
    { id: 3, name: 'RiteAid Express', address: '789 Express Way, New York, NY 10014', phone: '(555) 456-7890', distance: '1.2 mi', rating: 4.2 },
    { id: 4, name: 'Duane Reade Pharmacy', address: '321 Broadway, New York, NY 10010', phone: '(555) 111-2222', distance: '1.5 mi', rating: 4.6 },
  ];

  const filtered = pharmacies.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900">Change Preferred Pharmacy</h3>
          <p className="text-sm text-slate-400 mt-0.5">Select from nearby pharmacies</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <FiX size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pharmacies..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-all"
          />
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected === p.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-black text-slate-900 text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{p.address}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selected === p.id ? 'border-slate-900' : 'border-slate-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-slate-900 transition-opacity ${selected === p.id ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><FiMapPin size={11} /> {p.distance}</span>
                <span className="flex items-center gap-1"><FiPhone size={11} /> {p.phone}</span>
                <span className="flex items-center gap-1"><FiStar size={11} /> {p.rating}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={() => { onSave && onSave(pharmacies.find(p => p.id === selected)); onClose(); }}
          className={`w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer ${selected ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          Confirm Selection
        </button>
      </div>
    </ModalWrapper>
  );
};

export const InsuranceDetailsModal = ({ onClose }) => {
  const insurance = {
    provider: 'Aetna Platinum Plus',
    memberId: 'AET-7821-PX-2026',
    groupNumber: 'GRP-44210',
    type: 'Platinum HMO',
    effective: 'January 1, 2026',
    expiry: 'December 31, 2026',
    deductible: '$500',
    deductibleMet: '$320',
    coverage: [
      { name: 'Primary Care', covered: '100%' },
      { name: 'Specialist Visits', covered: '90%' },
      { name: 'Lab Tests', covered: '85%' },
      { name: 'Prescriptions (Generic)', covered: '100%' },
      { name: 'Prescriptions (Brand)', covered: '75%' },
      { name: 'Emergency Room', covered: '80%' },
    ],
  };

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-lg">
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiShield size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Coverage Active</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <h3 className="text-xl font-black">{insurance.provider}</h3>
        <p className="text-sm text-white/60 mt-1">{insurance.type} · Member ID: {insurance.memberId}</p>
      </div>

      <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Group Number', value: insurance.groupNumber },
            { label: 'Effective', value: insurance.effective },
            { label: 'Expires', value: insurance.expiry },
            { label: 'Plan Type', value: insurance.type },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-sm font-black text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Deductible Progress</p>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">Met: {insurance.deductibleMet}</span>
              <span className="font-black text-slate-900">Total: {insurance.deductible}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full" style={{ width: '64%' }} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Coverage Breakdown</p>
          <div className="space-y-2">
            {insurance.coverage.map(c => (
              <div key={c.name} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
                <span className="text-sm font-medium text-slate-600">{c.name}</span>
                <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{c.covered}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const DrugInteractionModal = ({ onClose, prescriptions = [] }) => {
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [result, setResult] = useState(null);

  const interactions = [
    { drugs: ['atorvastatin', 'sertraline'], severity: 'moderate', message: 'Monitor for increased statin side effects. Sertraline may slightly increase atorvastatin plasma levels.' },
    { drugs: ['metformin', 'lisinopril'], severity: 'low', message: 'Generally safe to combine. May have additive blood pressure lowering effects.' },
    { drugs: ['lisinopril', 'aspirin'], severity: 'moderate', message: 'NSAIDs including aspirin may reduce the antihypertensive effect of ACE inhibitors.' },
    { drugs: ['albuterol', 'metoprolol'], severity: 'major', message: 'Beta-blockers may antagonize the effects of albuterol, potentially causing bronchospasm.' },
  ];

  const checkInteraction = () => {
    const a = searchA.toLowerCase().trim();
    const b = searchB.toLowerCase().trim();
    const found = interactions.find(i => i.drugs.includes(a) && i.drugs.includes(b));
    setResult(found || { severity: 'none', message: 'No known significant interactions found between these medications. Always consult your doctor.' });
  };

  const severityConfig = {
    major: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', icon: 'error', label: 'Major Interaction' },
    moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: 'warning', label: 'Moderate Interaction' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', icon: 'info', label: 'Low Risk' },
    none: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-200 text-slate-900', icon: 'check_circle', label: 'No Interaction' },
  };

  return (
    <ModalWrapper onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900">Drug Interaction Checker</h3>
          <p className="text-sm text-slate-400 mt-0.5">Check interactions between your medications</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <FiX size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {prescriptions.length > 0 && (
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Medications</p>
            <div className="flex flex-wrap gap-2">
              {prescriptions.map(rx => (
                <button
                  key={rx.id}
                  onClick={() => !searchA ? setSearchA(rx.name) : setSearchB(rx.name)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-black text-slate-600 hover:border-slate-300 hover:bg-white transition-all cursor-pointer"
                >
                  {rx.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Drug A</label>
            <input
              type="text"
              value={searchA}
              onChange={e => setSearchA(e.target.value)}
              placeholder="e.g. Metformin"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Drug B</label>
            <input
              type="text"
              value={searchB}
              onChange={e => setSearchB(e.target.value)}
              placeholder="e.g. Lisinopril"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
          </div>
        </div>

        <button
          onClick={checkInteraction}
          disabled={!searchA.trim() || !searchB.trim()}
          className={`w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer ${searchA && searchB ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          Check Interaction
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${severityConfig[result.severity].bg} ${severityConfig[result.severity].border}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined text-2xl ${severityConfig[result.severity].text}`}>{severityConfig[result.severity].icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${severityConfig[result.severity].badge}`}>
                  {severityConfig[result.severity].label}
                </span>
              </div>
              <p className={`text-sm font-medium leading-relaxed ${severityConfig[result.severity].text}`}>{result.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-center text-slate-400 leading-relaxed">
          ⚠️ This tool is for informational purposes only. Always consult your healthcare provider before changing medications.
        </p>
      </div>
    </ModalWrapper>
  );
};
