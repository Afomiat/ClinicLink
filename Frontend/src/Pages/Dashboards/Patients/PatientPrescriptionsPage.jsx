import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiDownload, FiPlus,
  FiExternalLink, FiClock, FiActivity, FiMapPin, FiPhone,
  FiArrowRight, FiInfo, FiDroplet, FiCalendar, FiShield,
  FiChevronRight, FiFilter, FiCheckCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as ReTooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import RefillModal from './RefillModal'; 

const PatientPrescriptionsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 6;
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillPrescriptions, setRefillPrescriptions] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Analytics
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    refillNeeded: 0,
    adherenceScore: 94
  });

  const medicationVolumeData = [
    { name: 'Jan', pills: 40, adherence: 88 },
    { name: 'Feb', pills: 52, adherence: 92 },
    { name: 'Mar', pills: 45, adherence: 90 },
    { name: 'Apr', pills: 58, adherence: 95 },
    { name: 'May', pills: 48, adherence: 94 },
    { name: 'Jun', pills: 65, adherence: 97 },
  ];

  // Fetch data
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
          {
            id: 'RX-14529',
            name: 'Atorvastatin',
            dosage: '40mg',
            form: 'Tablet',
            frequency: 'Once daily',
            instructions: 'Take at bedtime',
            prescribedBy: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: 'May 28, 2023',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active',
            refills: 2,
            maxRefills: 5,
          },
          {
            id: 'RX-14530',
            name: 'Metformin',
            dosage: '500mg',
            form: 'Tablet',
            frequency: 'Twice daily',
            instructions: 'Take with meals',
            prescribedBy: 'Dr. Michael Chen',
            specialty: 'Endocrinology',
            date: 'May 28, 2023',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active',
            refills: 1,
            maxRefills: 3,
          },
          {
            id: 'RX-14531',
            name: 'Lisinopril',
            dosage: '10mg',
            form: 'Tablet',
            frequency: 'Once daily',
            instructions: 'Take in the morning',
            prescribedBy: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: 'Mar 10, 2023',
            pharmacy: 'Walgreens #3241',
            status: 'expired',
            refills: 0,
            maxRefills: 2,
          },
          {
            id: 'RX-14532',
            name: 'Albuterol',
            dosage: '90mcg',
            form: 'Inhaler',
            frequency: 'As needed',
            instructions: 'Use for asthma symptoms',
            prescribedBy: 'Dr. Emily Wong',
            specialty: 'Pediatrics',
            date: 'Jun 25, 2023',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active',
            refills: 5,
            maxRefills: 5,
          },
          {
            id: 'RX-14533',
            name: 'Omeprazole',
            dosage: '20mg',
            form: 'Capsule',
            frequency: 'Once daily',
            instructions: 'Take before breakfast',
            prescribedBy: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: 'Jul 08, 2023',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active',
            refills: 1,
            maxRefills: 3,
          },
          {
            id: 'RX-14534',
            name: 'Sertraline',
            dosage: '50mg',
            form: 'Tablet',
            frequency: 'Once daily',
            instructions: 'Take in the evening',
            prescribedBy: 'Dr. David Foster',
            specialty: 'Psychiatry',
            date: 'Aug 12, 2023',
            pharmacy: 'Main St. Pharmacy',
            status: 'active',
            refills: 3,
            maxRefills: 6,
          }
        ];

        setPrescriptions(mockData);
        setFilteredPrescriptions(mockData);

        const active = mockData.filter(p => p.status === 'active').length;
        setAnalytics({
          total: mockData.length,
          active,
          refillNeeded: mockData.filter(p => p.status === 'active' && p.refills === 0).length,
          adherenceScore: 94
        });
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    let results = [...prescriptions];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.prescribedBy.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      results = results.filter(p => p.status === statusFilter);
    }
    setFilteredPrescriptions(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, prescriptions]);

  const currentPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * prescriptionsPerPage,
    currentPage * prescriptionsPerPage
  );

  const handleRefillRequest = (rx) => {
    setRefillPrescriptions([{
      id: rx.id,
      medication: rx.name,
      dosage: rx.dosage,
      doctor: rx.prescribedBy,
      refills: rx.refills,
      originalPrescription: rx
    }]);
    setShowRefillModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-12 font-manrope">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Section - Refined */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-secondary-container/20 rounded-2xl flex items-center justify-center text-secondary shadow-lg border border-secondary/10">
                <FiActivity size={20} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Prescription Hub</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em] opacity-60">
              Managing {analytics.active} active medications for Sarah Johnson
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <button className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all">
              <FiDownload size={14} /> Export Data
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-[#000000] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#000000]/20 hover:bg-[#000000]/90 transition-all active:scale-95">
              <FiPlus size={14} /> New Entry
            </button>
          </motion.div>
        </div>

        {/* Analytics Section - Elegant & Compact */}
        <div className="grid grid-cols-12 gap-7">
          {/* Main Analytics Chart Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 shadow-[0px_20px_50px_rgba(15,23,42,0.04)] border border-slate-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Health Adherence</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">6-Month Trend Analysis</p>
                </div>
                <div className="flex bg-slate-50 p-0.5 rounded-xl border border-slate-100">
                  <button className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-[9px] font-black text-slate-900 uppercase tracking-widest">Pills</button>
                  <button className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Adherence</button>
                </div>
              </div>
              
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={medicationVolumeData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <ReTooltip 
                      contentStyle={{ 
                        borderRadius: '24px', 
                        border: 'none', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        padding: '16px',
                        background: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="pills" stroke="#0f172a" strokeWidth={5} fillOpacity={1} fill="url(#chartGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-slate-50 rounded-full blur-3xl opacity-50" />
          </motion.div>

          {/* Side Stats */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary-container/20 rounded-2xl p-4 border border-secondary/10 relative overflow-hidden group h-fit"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-1000 text-secondary">
                <FiActivity size={100} />
              </div>
              <div className="relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-6 w-6 bg-secondary/10 rounded-lg flex items-center justify-center border border-secondary/10 backdrop-blur-md">
                      <FiShield size={12} className="text-secondary" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Overall Score</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">{analytics.adherenceScore}%</h2>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-[180px]">Excellent adherence levels recorded this month.</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                    +2.4% vs Last Period
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3 h-fit"
            >
              <div className="h-10 w-10 bg-error/10 rounded-xl flex items-center justify-center text-error shrink-0">
                <FiClock size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Next Dose</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">08:00 AM</h4>
                    <p className="text-[10px] font-bold text-slate-500">Atorvastatin • 40mg</p>
                  </div>
                  <FiChevronRight size={18} className="text-slate-200" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Medication Grid - Luxurious & Compact Cards */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Prescription List</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">{filteredPrescriptions ? filteredPrescriptions.length : 0} Total</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="text"
                  placeholder="Filter by name or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-100 w-72 shadow-sm transition-all"
                />
              </div>
              <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                {['all', 'active', 'expired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === status ? 'bg-[#000000] text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {currentPrescriptions.map((rx) => (
                <motion.div
                  key={rx.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[200px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                        rx.status === 'active' ? 'bg-slate-50 text-slate-900' : 'bg-slate-50 text-slate-200'
                      }`}>
                        {rx.form === 'Tablet' ? <FiActivity size={24} /> : <FiDroplet size={24} />}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                        rx.status === 'active' ? 'bg-warning/10 text-secondary' : 'bg-error/10 text-error'
                      }`}>
                        {rx.status}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{rx.id}</p>
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors truncate">{rx.name}</h4>
                      <p className="text-[13px] font-bold text-slate-500 mt-1">{rx.dosage} • {rx.frequency}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                          <img src={`https://ui-avatars.com/api/?name=${rx.prescribedBy}&background=f8fafc&color=0f172a&bold=true`} alt="Doctor" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rx.specialty}</p>
                          <p className="text-sm font-black text-slate-800">{rx.prescribedBy}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refills Remaining</p>
                          <p className="text-xs font-black text-slate-900">{rx.refills} of {rx.maxRefills}</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${rx.refills <= 1 ? 'bg-error' : 'bg-warning'}`} 
                            style={{ width: `${(rx.refills / rx.maxRefills) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button 
                      onClick={() => {
                        setSelectedPrescription(rx);
                        setShowViewModal(true);
                      }} 
                      className="flex-1 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Details
                    </button>
                    {rx.status === 'active' && (
                      <button 
                        onClick={() => handleRefillRequest(rx)} 
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                          rx.refills === 0 ? 'bg-error text-white shadow-rose-100 hover:bg-error' : 'bg-[#000000] text-white shadow-slate-100 hover:bg-[#000000]/90'
                        }`}
                      >
                        {rx.refills === 0 ? 'Urgent' : 'Refill'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info Cards - Sleek */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shadow-inner">
                <FiMapPin size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Preferred Pharmacy</p>
                <h4 className="text-lg font-black text-slate-900 mb-0.5">CVS Healthcare Plaza</h4>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">1234 Healthcare Plaza, Suite 400, New York, NY 10012</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <FiPhone size={14} className="text-slate-400" /> (555) 012-3456
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Change</button>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shadow-inner">
                <FiShield size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Insurance Sync</p>
                <h4 className="text-lg font-black text-slate-900 mb-0.5">Aetna Platinum Plus</h4>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">Coverage Active until Dec 2026. All prescriptions synced.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs font-black text-secondary">
                <FiCheckCircle size={14} /> Fully Covered
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Details</button>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-secondary-container/20 rounded-3xl p-6 border border-secondary/10 flex flex-col justify-between gap-4 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center border border-secondary/10 shadow-sm">
                <FiInfo size={16} className="text-secondary" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Medical Advisory</p>
            </div>
            <p className="text-[15px] font-black leading-snug mb-4 text-slate-900">"Taking Sertraline with food significantly improves absorption and reduces stomach discomfort."</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-slate-900 transition-colors group">
              Drug Interaction Database <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showViewModal && selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription}
            onClose={() => setShowViewModal(false)}
          />
        )}
        {showRefillModal && (
          <RefillModal
            isOpen={showRefillModal}
            onClose={() => setShowRefillModal(false)}
            prescriptions={refillPrescriptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientPrescriptionsPage;