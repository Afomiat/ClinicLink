import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiX, FiActivity, FiCheckCircle, 
  FiClock, FiAlertCircle, FiMoreVertical, FiDownload, FiPrinter 
} from 'react-icons/fi';
import TestResultActionModal from './TestResultActionModal';
import ViewTestResultModal from './ViewTestResultModal';

const PatientTestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentActionResult, setCurrentActionResult] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  useEffect(() => {
    const sampleData = [
      {
        id: 'TR-1001',
        testName: 'Complete Blood Count',
        status: 'completed',
        date: '2026-04-25',
        labName: 'Main Hospital Lab',
        results: 'All values within normal range',
        doctor: 'Dr. Emily Carter',
        attachments: ['blood_test.pdf'],
        isAbnormal: false,
        category: 'Hematology'
      },
      {
        id: 'TR-1002',
        testName: 'Lipid Panel',
        status: 'completed',
        date: '2026-04-14',
        labName: 'City Lab Center',
        results: 'Cholesterol slightly elevated',
        doctor: 'Dr. Michael Brown',
        attachments: ['lipid_report.pdf'],
        isAbnormal: true,
        category: 'Biochemistry'
      },
      {
        id: 'TR-1003',
        testName: 'Thyroid Function Test',
        status: 'pending',
        date: '2026-05-01',
        labName: 'Main Hospital Lab',
        results: 'Results pending analysis',
        doctor: 'Dr. Lisa Wong',
        attachments: [],
        isAbnormal: false,
        category: 'Endocrinology'
      },
      {
        id: 'TR-1004',
        testName: 'Urinalysis',
        status: 'completed',
        date: '2026-03-10',
        labName: 'Westside Diagnostics',
        results: 'Normal results',
        doctor: 'Dr. Robert Chen',
        attachments: ['urinalysis.pdf'],
        isAbnormal: false,
        category: 'Urology'
      },
      {
        id: 'TR-1005',
        testName: 'Liver Function Test',
        status: 'completed',
        date: '2026-02-08',
        labName: 'Main Hospital Lab',
        results: 'Elevated liver enzymes detected',
        doctor: 'Dr. Sarah Johnson',
        attachments: ['liver_test.pdf', 'doctor_notes.pdf'],
        isAbnormal: true,
        category: 'Gastroenterology'
      }
    ];
    setTestResults(sampleData);
    setFilteredResults(sampleData);
  }, []);

  useEffect(() => {
    const filtered = testResults.filter(result => {
      if (filter !== 'all' && result.status.toLowerCase() !== filter.toLowerCase()) return false;
      
      const resultDate = new Date(result.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDateRange === 'today') {
        const resultDay = new Date(resultDate);
        resultDay.setHours(0, 0, 0, 0);
        if (resultDay.getTime() !== today.getTime()) return false;
      } else if (selectedDateRange === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        if (resultDate < startOfWeek) return false;
      } else if (selectedDateRange === 'month') {
        if (resultDate.getMonth() !== today.getMonth() || resultDate.getFullYear() !== today.getFullYear()) return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          result.testName.toLowerCase().includes(searchLower) ||
          result.labName.toLowerCase().includes(searchLower) ||
          result.doctor.toLowerCase().includes(searchLower) ||
          result.id.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
    setFilteredResults(filtered);
  }, [filter, searchTerm, selectedDateRange, testResults]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setIsViewModalOpen(true);
    setIsActionModalOpen(false); 
  };

  const handlePrintResult = (result) => {
    window.print();
  };

  const upcomingResults = filteredResults.filter(r => r.status === 'pending');
  const pastResults = filteredResults.filter(r => r.status === 'completed');

  return (
    <div className="max-w-[1280px] mx-auto px-lg py-lg font-inter bg-[#f8f9ff] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface font-manrope">Test Results</h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Track and manage your clinical lab records.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search results..."
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm focus:ring-2 focus:ring-secondary/20 w-full md:w-[300px] transition-all font-medium text-slate-600 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter items-start">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-md sticky top-24">
          <div className="bg-white rounded-xl p-sm border border-slate-100 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <div className="p-xs border-b border-slate-50 mb-sm flex items-center justify-between">
              <h3 className="font-label-md text-on-surface text-sm font-bold">Filters</h3>
              <button 
                onClick={() => { setFilter('all'); setSelectedDateRange('all'); setSearchTerm(''); }}
                className="text-[11px] font-bold text-secondary hover:underline uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-sm p-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Status</label>
                <div className="space-y-2">
                  {['all', 'completed', 'pending'].map(s => (
                    <label key={s} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer capitalize font-medium">
                      <input 
                        type="radio"
                        checked={filter === s}
                        onChange={() => setFilter(s)}
                        className="rounded-full border-slate-300 text-secondary focus:ring-secondary"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              
              <hr className="border-slate-50"/>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Timeframe</label>
                <div className="relative">
                  <select 
                    value={selectedDateRange} 
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-3 pr-10 text-[13px] text-slate-600 focus:ring-2 focus:ring-secondary/20 outline-none appearance-none cursor-pointer font-bold"
                  >
                    <option value="all">Lifetime</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-secondary-container/20 rounded-xl p-sm border border-secondary/10">
            <h4 className="font-bold text-sm text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
              Insights
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Abnormal</span>
                <span className="text-sm font-black text-error bg-error/10 px-2 py-0.5 rounded-full">
                  {testResults.filter(r => r.isAbnormal).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed</span>
                <span className="text-sm font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  {testResults.filter(r => r.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Pending Section */}
          {upcomingResults.length > 0 && (
            <div>
              <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
                Pending Analysis
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{upcomingResults.length}</span>
              </h3>
              <div className="space-y-3">
                {upcomingResults.map(result => (
                  <div key={result.id} className="bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between border border-slate-100 shadow-sm opacity-80 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-2xl font-light">hourglass_empty</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[16px] text-slate-900 font-bold tracking-tight">{result.testName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600">
                            {result.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">Requested on {formatDate(result.date)} • {result.labName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          <div>
            <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold">
              Lab Records History
            </h3>
            <div className="space-y-3">
              {pastResults.length > 0 ? pastResults.map(result => (
                <motion.div
                  key={result.id}
                  layout
                  className={`bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between border border-slate-100 transition-all group cursor-pointer hover:shadow-md ${result.isAbnormal ? 'bg-error/[0.04]' : ''}`}
                  onClick={() => handleViewResult(result)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${result.isAbnormal ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>
                      <span className="material-symbols-outlined text-2xl font-light">
                        {result.isAbnormal ? 'error_outline' : 'biotech'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[16px] text-slate-900 font-bold tracking-tight group-hover:text-secondary transition-colors">{result.testName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          result.isAbnormal ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                        }`}>
                          {result.isAbnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{result.doctor}</span>
                        <span>•</span>
                        <span>{result.labName}</span>
                        <span>•</span>
                        <span>{formatDate(result.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleViewResult(result); }}
                      className="px-4 py-1.5 bg-slate-50 text-[12px] font-black text-slate-600 hover:bg-slate-100 rounded-lg transition-all uppercase tracking-widest"
                    >
                      View Report
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentActionResult(result); setIsActionModalOpen(true); }}
                      className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-300"
                    >
                      <FiMoreVertical size={18} />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">search_off</span>
                  <p className="text-slate-400 text-sm font-medium">No test results match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isActionModalOpen && (
          <TestResultActionModal
            result={currentActionResult}
            onClose={() => setIsActionModalOpen(false)}
            onView={handleViewResult}
            onPrint={handlePrintResult}
          />
        )}
        {isViewModalOpen && (
          <ViewTestResultModal
            result={selectedResult}
            onClose={() => setIsViewModalOpen(false)}
            onPrint={handlePrintResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientTestResults;