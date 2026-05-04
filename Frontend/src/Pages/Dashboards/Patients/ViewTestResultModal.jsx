import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCalendar, FiUser, FiActivity, FiCheckCircle, 
  FiClock, FiAlertCircle, FiPrinter, FiDownload, FiFileText
} from 'react-icons/fi';

const ViewTestResultModal = ({ result, onClose, onPrint }) => {
  if (!result) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statusColors = {
    completed: result.isAbnormal ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary',
    pending: 'bg-amber-500/10 text-amber-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-inter">
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
              <span className="material-symbols-outlined text-secondary text-xl">biotech</span>
            </div>
            <h2 className="text-[17px] font-bold text-slate-900 font-manrope">Test Result Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600 hover:shadow-sm"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Result Title & Status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{result.testName}</h3>
              <p className="text-[13px] text-slate-500 font-medium uppercase tracking-wider">{result.category} • {result.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${statusColors[result.status]}`}>
              {result.isAbnormal ? 'Abnormal' : result.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date', value: formatDate(result.date), icon: 'event' },
              { label: 'Laboratory', value: result.labName, icon: 'science' },
              { label: 'Physician', value: result.doctor, icon: 'medical_services' },
              { label: 'Department', value: result.category, icon: 'category' }
            ].map((item, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex items-center gap-3 group hover:bg-white hover:shadow-md transition-all">
                <div className="p-2 bg-white rounded-xl text-slate-300 group-hover:text-secondary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-[13px] font-semibold text-slate-700 truncate max-w-[120px]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Findings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FiFileText className="text-slate-400" />
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Findings</h4>
            </div>
            <div className={`p-4 rounded-2xl border ${result.isAbnormal ? 'bg-error/[0.02] border-error/10' : 'bg-slate-50 border-slate-100/50'}`}>
              <p className={`text-[13px] leading-relaxed font-medium ${result.isAbnormal ? 'text-error' : 'text-slate-600'}`}>
                {result.results}
              </p>
            </div>
          </div>

          {/* Verification Note */}
          <div className="p-4 bg-slate-50/50 rounded-2xl flex items-start gap-3 border border-slate-50">
            <span className="material-symbols-outlined text-slate-300 text-lg">verified</span>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
              These results have been electronically verified and signed by the laboratory specialist on {formatDate(result.date)}.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between gap-3">
          <button 
            onClick={() => onPrint && onPrint(result)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-600 border border-slate-200 text-[13px] font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <FiPrinter size={16} /> Print PDF
          </button>
          <button 
            onClick={onClose}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white text-[13px] font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${result.isAbnormal ? 'bg-error hover:bg-error/90' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewTestResultModal;