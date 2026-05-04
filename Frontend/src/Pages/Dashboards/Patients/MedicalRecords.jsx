import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiChevronDown, FiChevronUp, FiFileText, FiActivity,
  FiMoreVertical, FiCalendar, FiClock
} from 'react-icons/fi';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockRecords = [
      {
        id: 'MR-101',
        date: '2026-04-15',
        type: 'Consultation',
        doctor: 'Dr. Sarah Johnson',
        diagnosis: 'Hypertension (I10)',
        summary: 'Patient presented with elevated blood pressure (145/92). Recommended lifestyle modifications and prescribed Lisinopril 10mg daily. Follow-up in 4 weeks.',
        attachments: [{ name: 'Lab_Results_20260415.pdf', size: '1.2 MB' }, { name: 'Prescription_20260415.pdf', size: '450 KB' }],
        isCritical: false,
        category: 'Cardiology'
      },
      {
        id: 'MR-102',
        date: '2026-03-22',
        type: 'Emergency Visit',
        doctor: 'Dr. Michael Chen',
        diagnosis: 'Acute Bronchitis (J20.9)',
        summary: 'Patient presented with persistent cough, fever, and chest discomfort. Diagnosed with acute bronchitis. Prescribed Azithromycin and recommended rest.',
        attachments: [{ name: 'XRay_Report_20260322.pdf', size: '4.5 MB' }],
        isCritical: true,
        category: 'Pulmonology'
      },
      {
        id: 'MR-103',
        date: '2026-01-10',
        type: 'Annual Physical',
        doctor: 'Dr. Emily Wilson',
        diagnosis: 'Routine Checkup (Z00.00)',
        summary: 'Comprehensive annual physical examination. All vitals within normal range. Cholesterol slightly elevated - recommended dietary adjustments.',
        attachments: [{ name: 'Bloodwork_20260110.pdf', size: '2.1 MB' }, { name: 'Physical_Report_20260110.pdf', size: '1.8 MB' }],
        isCritical: false,
        category: 'General Medicine'
      },
      {
        id: 'MR-104',
        date: '2025-11-18',
        type: 'Specialist Visit',
        doctor: 'Dr. Robert Kim',
        diagnosis: 'Palpitations (R00.2)',
        summary: 'Patient reported occasional heart palpitations. EKG showed normal sinus rhythm. Recommended stress test if symptoms persist.',
        attachments: [{ name: 'EKG_Report_20251118.pdf', size: '3.2 MB' }],
        isCritical: false,
        category: 'Cardiology'
      }
    ];

    setTimeout(() => {
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let results = records.filter(record => {
      if (filter !== 'all' && record.type.toLowerCase() !== filter.toLowerCase()) return false;
      
      const recordDate = new Date(record.date);
      const today = new Date();
      if (selectedTimeframe === 'year' && recordDate < new Date(today.setFullYear(today.getFullYear() - 1))) return false;
      if (selectedTimeframe === 'month' && recordDate < new Date(today.setMonth(today.getMonth() - 1))) return false;

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          record.doctor.toLowerCase().includes(lowerSearch) ||
          record.diagnosis.toLowerCase().includes(lowerSearch) ||
          record.type.toLowerCase().includes(lowerSearch) ||
          record.category.toLowerCase().includes(lowerSearch)
        );
      }
      return true;
    });
    setFilteredRecords(results);
  }, [searchTerm, filter, selectedTimeframe, records]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const categories = [
    { label: 'All Records', value: 'all', icon: 'folder' },
    { label: 'Consultations', value: 'consultation', icon: 'chat' },
    { label: 'Lab Work', value: 'lab work', icon: 'biotech' },
    { label: 'Emergency', value: 'emergency visit', icon: 'emergency' }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-lg py-lg font-inter bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface font-manrope">Medical Records</h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Access your complete digital health repository.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search diagnosis or doctor..."
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm focus:ring-2 focus:ring-primary/20 w-full md:w-[320px] transition-all font-medium text-slate-600 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter items-start">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-md sticky top-24">
          <div className="bg-white rounded-xl p-sm border border-slate-100 shadow-sm">
            <div className="p-xs border-b border-slate-50 mb-sm flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Repository Filters</h3>
              <button onClick={() => {setFilter('all'); setSelectedTimeframe('all'); setSearchTerm('')}} className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">Reset</button>
            </div>
            
            <div className="space-y-sm p-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Categories</label>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setFilter(cat.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-bold ${
                        filter === cat.value ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <hr className="border-slate-50"/>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Timeframe</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-[13px] text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="all">Lifetime Records</option>
                  <option value="year">Last 12 Months</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-secondary-container/20 rounded-xl p-sm border border-secondary/10">
            <h4 className="font-bold text-sm text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              Health Snapshot
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase">Critical Reports</span>
                <span className="font-black text-error bg-error/10 px-2 py-0.5 rounded-full">{records.filter(r => r.isCritical).length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase">Recent Updates</span>
                <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">2 New</span>
              </div>
            </div>
          </div>
        </div>

        {/* Records Main Feed */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold">Chronological Records</h3>
          
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-bold uppercase tracking-widest">Retrieving Digital Records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl overflow-hidden border transition-all hover:shadow-md ${
                  record.isCritical ? 'border-error/20' : 'border-slate-100'
                }`}
              >
                <div 
                  className={`p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    expandedId === record.id ? 'bg-slate-50/50' : ''
                  }`}
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      record.isCritical ? 'bg-error/10 text-error' : 'bg-primary/5 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl font-light">
                        {record.type.toLowerCase().includes('emergency') ? 'emergency' : 'description'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[16px] text-slate-900 font-bold tracking-tight">{record.type}</h4>
                        {record.isCritical && (
                          <span className="px-2 py-0.5 bg-error/10 text-error rounded-full text-[8px] font-black uppercase tracking-widest">
                            Critical Alert
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{record.doctor}</span>
                        <span>•</span>
                        <span>{record.category}</span>
                        <span>•</span>
                        <span>{formatDate(record.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right pr-4 border-r border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis</p>
                      <p className="text-[13px] font-bold text-slate-700">{record.diagnosis}</p>
                    </div>
                    <div className={`p-2 rounded-full transition-all ${expandedId === record.id ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      <FiChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100"
                    >
                      <div className="p-6 space-y-6">
                        {/* Summary Section */}
                        <div className="space-y-3">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FiFileText /> Visit Summary & Plan
                          </h5>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
                              "{record.summary}"
                            </p>
                          </div>
                        </div>

                        {/* Attachments Section */}
                        {record.attachments.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">attach_file</span>
                              Digital Attachments ({record.attachments.length})
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {record.attachments.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:shadow-sm transition-all">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{file.name}</p>
                                      <p className="text-[10px] text-slate-400">{file.size}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors" title="Download">
                                      <FiDownload size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors" title="Print">
                                      <FiPrinter size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verification Note */}
                        <div className="p-4 bg-secondary/5 rounded-2xl flex items-start gap-3 border border-secondary/10">
                          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                            This record has been finalized and verified by {record.doctor} on {formatDate(record.date)}. It constitutes a legal medical document.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-xl p-20 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No matching records discovered</p>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-8">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              For security, records are encrypted with AES-256 standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;