import React from 'react';
import { 
  FiX, FiPrinter, FiCalendar, FiUser, FiFileText
} from 'react-icons/fi';

const ViewPrescriptionModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription: ${prescription.medication}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
            body {
              font-family: 'Manrope', sans-serif;
              line-height: 1.6;
              color: #0f172a;
              padding: 30px;
              background-color: #f8fafc;
            }
            .prescription-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 35px;
              border-radius: 24px;
              box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
              border: 1px solid #e2e8f0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .rx-symbol {
              font-size: 2rem;
              font-weight: 800;
              color: #0f172a;
            }
            .clinic-name {
              font-size: 1.25rem;
              font-weight: 800;
              color: #0f172a;
              text-align: right;
            }
            .section {
              margin-bottom: 25px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 16px;
              border: 1px solid #f1f5f9;
            }
            .section-title {
              font-size: 0.85rem;
              font-weight: 800;
              color: #0f172a;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 12px;
            }
            .patient-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .label {
              font-weight: 800;
              color: #94a3b8;
              display: block;
              margin-bottom: 3px;
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .value {
              font-weight: 700;
              color: #0f172a;
              font-size: 0.95rem;
            }
            .signature-area {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px dashed #cbd5e1;
              width: 250px;
            }
            .signature-line {
              margin-top: 30px;
              border-top: 1.5px solid #0f172a;
              width: 180px;
            }
            .footer-note {
              margin-top: 30px;
              font-size: 0.75rem;
              color: #94a3b8;
              text-align: center;
              font-weight: 600;
            }
            @media print {
              body { padding: 0; background: white; }
              .prescription-container { box-shadow: none; padding: 20px; border: none; }
            }
          </style>
        </head>
        <body>
          <div class="prescription-container">
            <div class="header">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="rx-symbol">℞</span>
                <div>
                  <div style="font-weight: 800; font-size: 1.2rem; color: #0f172a;">PRESCRIPTION DETAILS</div>
                  <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">HealthPlus Medical Systems</div>
                </div>
              </div>
              <div class="clinic-name">ClinicLink Health</div>
            </div>
            
            <div class="section">
              <div class="section-title">Medication Information</div>
              <div class="patient-info">
                <div>
                  <span class="label">Medication</span>
                  <span class="value">${prescription.medication}</span>
                </div>
                <div>
                  <span class="label">Dosage</span>
                  <span class="value">${prescription.dosage}</span>
                </div>
                <div>
                  <span class="label">Status</span>
                  <span class="value">${prescription.status}</span>
                </div>
                <div>
                  <span class="label">HealthPlus ID</span>
                  <span class="value">HP-${Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Prescription Dates</div>
              <div class="patient-info">
                <div>
                  <span class="label">Date Prescribed</span>
                  <span class="value">${new Date(prescription.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="label">Last Filled</span>
                  <span class="value">${prescription.lastFilled ? new Date(prescription.lastFilled).toLocaleDateString() : 'Not filled yet'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Prescribing Physician</div>
              <div class="patient-info">
                <div>
                  <span class="label">Doctor</span>
                  <span class="value">Dr. ${prescription.doctor}</span>
                </div>
                <div>
                  <span class="label">Specialty</span>
                  <span class="value">${prescription.specialty || 'HealthPlus General Practice'}</span>
                </div>
              </div>
            </div>

            ${prescription.instructions ? `
              <div class="section">
                <div class="section-title">Instructions</div>
                <div class="value">${prescription.instructions}</div>
              </div>
            ` : ''}
            
            <div class="signature-area">
              <div style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Physician Signature:</div>
              <div class="signature-line"></div>
              <div style="margin-top: 5px; font-size: 0.85rem; font-weight: 800; color: #0f172a;">
                Dr. ${prescription.doctor}
              </div>
            </div>
            
            <div class="footer-note">
              This HealthPlus prescription is valid for fulfillment at any participating pharmacy.<br />
              For questions, please contact HealthPlus Support.
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-manrope">
      <div 
        className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-slate-100 max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="icon-box w-12 h-12">
              <span className="material-symbols-outlined text-slate-900 text-2xl">pill</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-manrope tracking-tight">Prescription Details</h2>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5">Reference ID: HP-${Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 scrollbar-hide">
          {/* Medication Info Card */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 font-manrope flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-slate-900 text-lg">pill</span>
              Medication Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Medication</span>
                <span className="text-sm font-extrabold text-slate-900">{prescription.medication}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dosage</span>
                <span className="text-sm font-extrabold text-slate-900">{prescription.dosage}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {prescription.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">HealthPlus ID</span>
                <span className="text-sm font-extrabold text-slate-900">HP-${Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            </div>
          </div>

          {/* Prescription Dates Card */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 font-manrope flex items-center gap-2 mb-4">
              <FiCalendar className="text-slate-900" size={16} />
              Prescription Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Date Prescribed</span>
                <span className="text-sm font-extrabold text-slate-900">{new Date(prescription.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Filled</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {prescription.lastFilled ? new Date(prescription.lastFilled).toLocaleDateString() : 'Not filled yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Prescribing Doctor Card */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 font-manrope flex items-center gap-2 mb-4">
              <FiUser className="text-slate-900" size={16} />
              Prescribing Doctor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Doctor</span>
                <span className="text-sm font-extrabold text-slate-900">Dr. {prescription.doctor}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialty</span>
                <span className="text-sm font-extrabold text-slate-900">{prescription.specialty || 'HealthPlus General Practice'}</span>
              </div>
            </div>
          </div>

          {/* Instructions if available */}
          {prescription.instructions && (
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 font-manrope flex items-center gap-2 mb-2">
                <FiFileText className="text-slate-900" size={16} />
                Instructions
              </h3>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">{prescription.instructions}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
          <button 
            onClick={onClose}
            className="border border-slate-200 bg-white text-slate-700 rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <FiPrinter size={16} /> Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescriptionModal;