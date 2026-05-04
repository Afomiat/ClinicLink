import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEye, FiPrinter, FiDownload, FiShare2 } from 'react-icons/fi';

const TestResultActionModal = ({ result, onClose, onView, onPrint }) => {
  if (!result) return null;

  const actions = [
    { label: 'View Report', icon: 'visibility', color: 'text-secondary', bg: 'bg-secondary/10', onClick: () => { onView(result); onClose(); } },
    { label: 'Print Results', icon: 'print', color: 'text-blue-500', bg: 'bg-blue-50', onClick: () => { onPrint(result); onClose(); } },
    { label: 'Download PDF', icon: 'download', color: 'text-purple-500', bg: 'bg-purple-50', onClick: () => { /* Download */ onClose(); } },
    { label: 'Share Report', icon: 'share', color: 'text-amber-600', bg: 'bg-amber-50', onClick: () => { /* Share */ onClose(); } },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-inter">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-[280px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Actions</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-full text-slate-300 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <div className="space-y-1.5">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
            >
              <div className={`p-2 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-lg">{action.icon}</span>
              </div>
              <span className="text-[13px] font-bold text-slate-700 tracking-tight">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-50 text-slate-400 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-100 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TestResultActionModal;