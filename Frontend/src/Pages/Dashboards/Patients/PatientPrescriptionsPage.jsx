import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiDownload, FiPlus,
  FiExternalLink, FiClock, FiActivity, FiMapPin, FiPhone,
  FiArrowRight, FiInfo, FiDroplet, FiCalendar, FiShield,
  FiChevronRight, FiFilter, FiCheckCircle, FiTrendingUp,
  FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as ReTooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { exportToPDF } from '../../../utils/exportUtils';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import RefillModal from './RefillModal'; 
import { ChangePharmacyModal, InsuranceDetailsModal, DrugInteractionModal } from './SharedModals';

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
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  // Filters & Graph mode
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chartMetric, setChartMetric] = useState('pills'); // 'pills' | 'adherence'
  const [timeRange, setTimeRange] = useState('6M'); // '3M' | '6M' | '1Y'

  // Analytics State
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    refillNeeded: 0,
    adherenceScore: 96
  });

  // Interactive Chart Data
  const medicationData3M = [
    { name: 'Apr', pills: 58, adherence: 95 },
    { name: 'May', pills: 48, adherence: 94 },
    { name: 'Jun', pills: 65, adherence: 98 },
  ];

  const medicationData6M = [
    { name: 'Jan', pills: 40, adherence: 88 },
    { name: 'Feb', pills: 52, adherence: 92 },
    { name: 'Mar', pills: 45, adherence: 90 },
    { name: 'Apr', pills: 58, adherence: 95 },
    { name: 'May', pills: 48, adherence: 94 },
    { name: 'Jun', pills: 65, adherence: 98 },
  ];

  const medicationData1Y = [
    { name: 'Jul', pills: 42, adherence: 85 },
    { name: 'Aug', pills: 44, adherence: 89 },
    { name: 'Sep', pills: 49, adherence: 91 },
    { name: 'Oct', pills: 51, adherence: 93 },
    { name: 'Nov', pills: 46, adherence: 90 },
    { name: 'Dec', pills: 55, adherence: 96 },
    { name: 'Jan', pills: 40, adherence: 88 },
    { name: 'Feb', pills: 52, adherence: 92 },
    { name: 'Mar', pills: 45, adherence: 90 },
    { name: 'Apr', pills: 58, adherence: 95 },
    { name: 'May', pills: 48, adherence: 94 },
    { name: 'Jun', pills: 65, adherence: 98 },
  ];

  const chartData = timeRange === '3M' ? medicationData3M : timeRange === '1Y' ? medicationData1Y : medicationData6M;

  // Fetch data
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = [
          {
            id: 'RX-14529',
            name: 'Atorvastatin',
            dosage: '40mg',
            form: 'Tablet',
            frequency: 'Once daily',
            instructions: 'Take at bedtime with water',
            prescribedBy: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: 'May 28, 2024',
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
            instructions: 'Take with morning & evening meals',
            prescribedBy: 'Dr. Michael Chen',
            specialty: 'Endocrinology',
            date: 'May 28, 2024',
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
            date: 'Mar 10, 2024',
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
            instructions: 'Use for acute asthma symptoms',
            prescribedBy: 'Dr. Emily Wong',
            specialty: 'Pulmonology',
            date: 'Jun 25, 2024',
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
            instructions: 'Take 30 mins before breakfast',
            prescribedBy: 'Dr. Sarah Johnson',
            specialty: 'Gastroenterology',
            date: 'Jul 08, 2024',
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
            instructions: 'Take in the evening after dinner',
            prescribedBy: 'Dr. David Foster',
            specialty: 'Psychiatry',
            date: 'Aug 12, 2024',
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
          refillNeeded: mockData.filter(p => p.status === 'active' && p.refills <= 1).length,
          adherenceScore: 96
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

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-manrope">
          <p className="font-bold text-amber-400 mb-1">{label}</p>
          <p className="font-medium">{chartMetric === 'pills' ? `Pills: ${payload[0].value}` : `Adherence: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-8 py-8 pb-16 min-h-screen bg-slate-50/50 font-manrope">
      <div className="max-w-[1280px] mx-auto space-y-8">
        
        {/* Page Header (Matching Appointments & Dashboard style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-manrope">Prescription Hub</h2>
            <p className="text-sm text-slate-500 mt-1">Manage active medications, dosages, and pharmacy refill requests.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary-container/20 text-secondary px-4 py-2 rounded-full text-xs font-bold border border-secondary/10">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              {analytics.active} Active Medications
            </div>
            <button 
              onClick={() => {
                exportToPDF(
                  'Patient Prescription List',
                  ['RX ID', 'Name', 'Dosage', 'Frequency', 'Doctor', 'Refills', 'Status'],
                  filteredPrescriptions.map(p => [p.id, p.name, p.dosage, p.frequency, p.prescribedBy, `${p.refills}/${p.maxRefills}`, p.status]),
                  'Prescriptions_List'
                );
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <FiDownload size={14} /> Export List
            </button>
          </div>
        </div>

        {/* Analytics Graph & Stats Row */}
        <div className="grid grid-cols-12 gap-5">
          {/* Real Recharts Chart Card */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-manrope">Medication Adherence Trend</h3>
                <p className="text-xs text-slate-400">Monthly dosage compliance analytics</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  <button 
                    onClick={() => setChartMetric('pills')}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      chartMetric === 'pills' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Pills
                  </button>
                  <button 
                    onClick={() => setChartMetric('adherence')}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      chartMetric === 'adherence' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Adherence %
                  </button>
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  {['3M', '6M', '1Y'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                        timeRange === t ? 'bg-slate-900 text-white font-black' : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[180px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pillsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <ReTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey={chartMetric} 
                    stroke="#0f172a" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#pillsGrad)" 
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Cards: Next Dose & Refill Alert */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            {/* Next Dose */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
                  Next Scheduled Dose
                </div>
                <span className="text-xs font-bold text-secondary bg-secondary-container/20 px-2.5 py-0.5 rounded-full border border-secondary/10">08:00 PM</span>
              </div>
              <div className="my-2">
                <h4 className="text-base font-extrabold text-slate-900">Atorvastatin • 40mg</h4>
                <p className="text-xs text-slate-500">Take at bedtime with water</p>
              </div>
              <button 
                onClick={() => {
                  if (prescriptions.length > 0) {
                    setSelectedPrescription(prescriptions[0]);
                    setShowViewModal(true);
                  }
                }}
                className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-50"
              >
                View Details & Instructions →
              </button>
            </div>

            {/* Refill Notice */}
            <div className="bg-secondary-container/15 rounded-2xl p-5 border border-secondary/10 shadow-sm flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]">error_outline</span>
                  Refill Needed
                </div>
                <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Urgent</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 font-medium">Metformin (500mg) has only 1 refill left.</p>
              <button 
                onClick={() => {
                  const target = prescriptions.find(p => p.name === 'Metformin') || prescriptions[0];
                  if (target) handleRefillRequest(target);
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <FiRefreshCw size={12} /> Request Refill
              </button>
            </div>
          </div>
        </div>

        {/* Prescription List Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 font-manrope">Prescription List</h3>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{filteredPrescriptions.length} Total</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search medication or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 w-56 shadow-sm"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex bg-white p-0.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-bold">
                {['all', 'active', 'expired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                      statusFilter === status ? 'bg-slate-900 text-white shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {currentPrescriptions.map((rx) => (
                <motion.div
                  key={rx.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                        <span className="material-symbols-outlined text-[20px]">
                          {rx.form === 'Inhaler' ? 'air' : 'pill'}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rx.status === 'active' 
                          ? 'bg-secondary/10 text-secondary border border-secondary/20'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {rx.status === 'active' ? (rx.refills <= 1 ? 'Refill Soon' : 'Active') : 'Expired'}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rx.id}</p>
                      <h4 className="text-lg font-extrabold text-slate-900">{rx.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">{rx.dosage} • {rx.form} • {rx.frequency}</p>
                    </div>

                    <p className="text-xs text-slate-400 italic">"{rx.instructions}"</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{rx.prescribedBy}</span>
                      <span className="font-bold text-slate-900">{rx.refills}/{rx.maxRefills} Refills Left</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => {
                        setSelectedPrescription(rx);
                        setShowViewModal(true);
                      }} 
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Details
                    </button>
                    {rx.status === 'active' && (
                      <button 
                        onClick={() => handleRefillRequest(rx)} 
                        className="flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1 bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <FiRefreshCw size={12} /> Refill
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <span className="material-symbols-outlined text-secondary text-[20px]">local_pharmacy</span>
                Preferred Pharmacy
              </div>
              <h4 className="text-base font-extrabold text-slate-900">CVS Healthcare Plaza</h4>
              <p className="text-xs text-slate-500 mt-0.5">1234 Healthcare Plaza, Suite 400, NY</p>
            </div>
            <button 
              onClick={() => setShowPharmacyModal(true)}
              className="text-xs font-bold text-secondary hover:underline mt-4 cursor-pointer text-left"
            >
              Change Pharmacy →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                Insurance Coverage
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Aetna Platinum Plus</h4>
              <p className="text-xs text-slate-500 mt-0.5">Coverage Active • All prescriptions 100% synced</p>
            </div>
            <button 
              onClick={() => setShowInsuranceModal(true)}
              className="text-xs font-bold text-secondary hover:underline mt-4 cursor-pointer text-left"
            >
              View Coverage Details →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
                Safety Advisory
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">"Taking Sertraline with food significantly improves absorption and reduces stomach discomfort."</p>
            </div>
            <button 
              onClick={() => setShowInteractionModal(true)}
              className="text-xs font-bold text-slate-900 hover:text-slate-700 mt-4 cursor-pointer text-left"
            >
              Check Drug Interactions →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
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
        {showPharmacyModal && (
          <ChangePharmacyModal
            onClose={() => setShowPharmacyModal(false)}
          />
        )}
        {showInsuranceModal && (
          <InsuranceDetailsModal
            onClose={() => setShowInsuranceModal(false)}
          />
        )}
        {showInteractionModal && (
          <DrugInteractionModal
            onClose={() => setShowInteractionModal(false)}
            prescriptions={prescriptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientPrescriptionsPage;