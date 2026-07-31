import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, FiPrinter, FiFileText
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-manrope">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="icon-box w-12 h-12">
              <span className="material-symbols-outlined text-slate-900 text-2xl">biotech</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-manrope tracking-tight">Test Result Details</h2>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5">{result.category || 'Laboratory Analysis'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto pr-1 flex-1 scrollbar-hide">
          {/* Result Title & Status */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-1">{result.testName || result.shortName}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{result.category} • {result.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
              result.isAbnormal ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {result.isAbnormal ? 'Abnormal' : result.statusLabel || result.status || 'Completed'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Date', value: formatDate(result.date), icon: 'event' },
              { label: 'Laboratory', value: result.labName || 'ClinicLink Diagnostics', icon: 'science' },
              { label: 'Physician', value: result.doctor || 'Dr. Robert Chen', icon: 'medical_services' },
              { label: 'Department', value: result.category || 'Pathology', icon: 'category' }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
                <div className="icon-box w-10 h-10 shrink-0">
                  <span className="material-symbols-outlined text-lg text-slate-900">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs font-extrabold text-slate-900 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Findings */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 font-manrope flex items-center gap-2 mb-2">
              <FiFileText className="text-slate-900" size={16} />
              Clinical Findings & Value
            </h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {result.results || `Value recorded: ${result.value || 'Normal'}. Electronically signed and verified.`}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
          <button 
            onClick={onClose}
            className="border border-slate-200 bg-white text-slate-700 rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button 
            onClick={() => onPrint && onPrint(result)}
            className="bg-slate-900 text-white rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <FiPrinter size={16} /> Print PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewTestResultModal;