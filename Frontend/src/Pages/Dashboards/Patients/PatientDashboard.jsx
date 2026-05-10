import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import PatientDashboardModal from './PatientDashboardModal';
import RescheduleModal from './RescheduleModal';
import RefillModal from './RefillModal';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import ViewTestResultModal from './ViewTestResultModal';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    profile: {
      name: 'Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      age: 42,
      gender: 'Female',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ',
      lastLogin: new Date().toISOString(),
    },
    stats: {
      upcomingAppointments: 2,
      activePrescriptions: 3,
      testResults: 5,
    },
    appointments: [
      {
        id: 1,
        doctor: 'Robert Chen',
        specialty: 'Cardiology',
        date: new Date(Date.now() + 86400000 * 3).toISOString(),
        time: '10:30 AM',
        location: 'Main Hospital, Room 302',
        status: 'Scheduled',
      },
      {
        id: 2,
        doctor: 'Lisa Wong',
        specialty: 'Dermatology',
        date: new Date(Date.now() + 86400000 * 8).toISOString(),
        time: '2:15 PM',
        location: 'West Clinic',
        status: 'Scheduled',
      },
    ],
    prescriptions: [
      {
        id: 1,
        medication: 'Atorvastatin',
        dosage: '40mg once daily',
        status: 'active',
        doctor: 'Robert Chen',
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        instructions: 'Take with food at bedtime',
        category: 'CHOLESTEROL',
        color: 'purple',
      },
      {
        id: 2,
        medication: 'Lisinopril',
        dosage: '10mg once daily',
        status: 'active',
        doctor: 'Robert Chen',
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
        instructions: 'Take in the morning',
        category: 'BLOOD PRESSURE',
        color: 'blue',
      },
      {
        id: 3,
        medication: 'Selemon',
        dosage: '10mg once daily',
        status: 'active',
        doctor: 'Robert Chen',
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
        instructions: 'Take in the morning',
        category: 'VITAMINS',
        color: 'orange',
      },
      {
        id: 4,
        medication: 'Metformin',
        dosage: '500mg twice daily',
        status: 'active',
        doctor: 'Robert Chen',
        date: new Date(Date.now() - 86400000 * 20).toISOString(),
        instructions: 'Take with meals',
        category: 'DIABETES',
        color: 'green',
      },
    ],
    testResults: [
      {
        id: 1,
        testName: 'Complete Blood Count',
        shortName: 'CBC',
        status: 'Completed',
        statusLabel: 'Normal',
        statusColor: 'green',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        labName: 'City Lab Center',
        results: 'All values within normal range',
        value: '14.2 g/dL',
      },
      {
        id: 2,
        testName: 'Lipid Panel',
        shortName: 'Lipid Panel',
        status: 'Completed',
        statusLabel: 'Elevated',
        statusColor: 'orange',
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        labName: 'Main Hospital Lab',
        results: 'Cholesterol slightly elevated',
        value: '185 mg/dL',
      },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [viewingTestResult, setViewingTestResult] = useState(null);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUpcomingAppointment = () => {
    const now = new Date();
    const upcoming = patientData.appointments
      .filter((app) => new Date(app.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleReschedule = (updatedAppointment) => {
    setPatientData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((app) =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      ),
    }));
  };

  const colorMap = {
    purple: { border: 'border-l-purple-500', label: 'text-primary', bg: 'bg-primary/10' },
    blue:   { border: 'border-l-blue-500',   label: 'text-primary',   bg: 'bg-primary/10'   },
    orange: { border: 'border-l-orange-500', label: 'text-warning', bg: 'bg-warning/10' },
    green:  { border: 'border-l-green-500',  label: 'text-secondary',  bg: 'bg-secondary/10'  },
  };

  const statusColorMap = {
    green:  'bg-secondary/10 text-secondary',
    orange: 'bg-warning/10 text-warning',
    red:    'bg-error/10 text-error',
  };

  const nextAppt = getUpcomingAppointment();
  const displayedPrescriptions = patientData.prescriptions
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      return (
        p.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const activityBars = [40, 65, 50, 85, 70, 95, 60];
  const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="px-8 py-8 pb-16 min-h-screen bg-background">

      {/* ── Welcome Header ── */}
      <div className="mb-8 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-manrope">
            Welcome back, {patientData.profile.firstName} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Your health status is stable. Last login:{' '}
            {new Date(patientData.profile.lastLogin).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-warning-container/20 text-secondary px-4 py-2 rounded-full text-xs font-bold border border-secondary/10">
          <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          Systems Normal
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Appointments */}
        <div className="glass-card p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer"
          onClick={() => navigate('appointments')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mb-1">{patientData.stats.upcomingAppointments}</p>
          <p className="text-sm text-slate-500">Upcoming Appointments</p>
        </div>

        {/* Prescriptions */}
        <div className="glass-card p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer"
          onClick={() => navigate('prescriptions')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">medication</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mb-1">{patientData.stats.activePrescriptions}</p>
          <p className="text-sm text-slate-500">Active Prescriptions</p>
        </div>

        {/* Test Results */}
        <div className="glass-card p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-all cursor-pointer"
          onClick={() => navigate('test-results')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">biotech</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mb-1">{patientData.stats.testResults}</p>
          <p className="text-sm text-slate-500">Test Results</p>
        </div>

        {/* Health Status – box style */}
        <div className="p-6 rounded-2xl shadow-sm bg-secondary-container/20 border border-secondary/10 hover:-translate-y-1 transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">favorite</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current</span>
          </div>
          <p className="text-3xl font-extrabold mb-1 text-slate-900">Good</p>
          <p className="text-sm text-slate-500">Health Status</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-12 gap-7">

        {/* Left column (8) */}
        <div className="col-span-12 lg:col-span-8 space-y-7">

          {/* Next Appointment */}
          {nextAppt && (
            <section className="glass-card rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900 font-manrope flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">event</span>
                  Next Appointment
                </h3>
                <button
                  className="text-sm font-semibold text-primary hover:underline"
                  onClick={() => setIsModalOpen(true)}
                >
                  View Calendar
                </button>
              </div>

              <div className="p-6 flex flex-wrap items-center gap-6">
                {/* Doctor Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-extrabold text-primary">
                      {nextAppt.doctor.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-warning text-white p-1 rounded-lg">
                    <span className="material-symbols-outlined text-sm">verified</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h4 className="text-lg font-bold text-slate-900">Dr. {nextAppt.doctor}</h4>
                    <span className="px-2 py-0.5 bg-warning/10 text-primary text-[10px] font-black uppercase tracking-wider rounded">
                      {nextAppt.specialty}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                      {formatDate(nextAppt.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                      {nextAppt.time}
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                      {nextAppt.location}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="bg-[#000000] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#000000]/90 transition-colors shadow-lg shadow-[#000000]/20">
                    Join Telehealth
                  </button>
                  <button
                    className="border border-slate-200 text-slate-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      setAppointmentToReschedule(nextAppt);
                      setIsRescheduleModalOpen(true);
                    }}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Prescriptions */}
          <section className="glass-card rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-3">
              <h3 className="text-base font-bold text-slate-900 font-manrope flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">medication</span>
                My Prescriptions
              </h3>
              <div className="flex gap-3 items-center flex-wrap">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">search</span>
                  <input
                    className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-40 focus:outline-none focus:ring-1 focus:ring-purple-200"
                    placeholder="Search meds..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  className="bg-[#000000] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#000000] transition-colors flex items-center gap-1"
                  onClick={() => setIsRefillModalOpen(true)}
                >
                  <FiRefreshCw className="text-xs" /> Request Refill
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {displayedPrescriptions.map((prescription) => {
                  const c = colorMap[prescription.color] || colorMap.blue;
                  return (
                    <div
                      key={prescription.id}
                      className={`p-5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-white hover:shadow-md transition-all border-l-4 cursor-pointer ${c.border}`}
                      onClick={() => setViewingPrescription(prescription)}
                    >
                      <p className={`text-[10px] font-black mb-1 uppercase tracking-wider ${c.label}`}>
                        {prescription.category}
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm mb-2">{prescription.medication}</h4>
                      <div className="space-y-1 text-xs text-slate-500">
                        <p><span className="font-semibold text-slate-700">Dosage:</span> {prescription.dosage}</p>
                        <p><span className="font-semibold text-slate-700">Dr.</span> {prescription.doctor}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {patientData.prescriptions.length > 3 && (
                <div className="mt-5 text-center">
                  <Link
                    to="prescriptions"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View All <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right column (4) */}
        <div className="col-span-12 lg:col-span-4 space-y-7">

          {/* Test Results */}
          <section className="glass-card rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 font-manrope flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">biotech</span>
                Latest Results
              </h3>
            </div>
            <div className="p-5">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Test</th>
                    <th className="pb-3">Result</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientData.testResults.map((test) => (
                    <tr
                      key={test.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setViewingTestResult(test)}
                    >
                      <td className="py-3">
                        <p className="font-bold text-slate-800 text-sm">{test.shortName}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(test.date)}</p>
                      </td>
                      <td className="py-3 text-sm font-medium text-slate-700">{test.value}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          test.statusColor === 'green' ? 'bg-warning/10 text-secondary' : 'bg-warning/10 text-warning'
                        }`}>
                          {test.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="w-full mt-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                onClick={() => navigate('test-results')}
              >
                View All Lab Work
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Activity Insights */}
          <section className="glass-card rounded-2xl shadow-sm p-6 bg-gradient-to-br from-white to-secondary/5 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 font-manrope">
              <span className="material-symbols-outlined text-secondary text-xl">show_chart</span>
              Health Activity
            </h3>
            <div className="h-36 flex items-end gap-2 px-1">
              {activityBars.map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-lg transition-colors cursor-pointer ${
                    i === 5 ? 'bg-warning' : 'bg-warning/10 hover:bg-warning/40'
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {dayLabels.map((day, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-bold ${i === 5 ? 'text-secondary' : 'text-slate-400'}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 font-manrope mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'person_search', label: 'Find a Doctor', sub: 'Search specialists', color: 'blue', action: () => navigate('doctors', { state: { activeTab: 'allDoctors' } }) },
            { icon: 'event_available', label: 'Book Appointment', sub: 'Schedule a visit', color: 'green', action: () => navigate('appointments') },
            { icon: 'chat', label: 'Message Doctor', sub: 'Secure consultation', color: 'orange', action: () => navigate('messages') },
            { icon: 'folder_shared', label: 'Medical Records', sub: 'Download history', color: 'purple', action: () => navigate('medical-records') },
          ].map(({ icon, label, sub, color, action }) => {
            const hoverMap = {
              blue: 'group-hover:bg-primary group-hover:text-white bg-primary/10 text-primary',
              green: 'group-hover:bg-secondary group-hover:text-white bg-secondary/10 text-secondary',
              orange: 'group-hover:bg-warning group-hover:text-white bg-warning/10 text-warning',
              purple: 'group-hover:bg-primary group-hover:text-white bg-primary/10 text-primary',
            };
            return (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-4 p-5 glass-card rounded-2xl border border-slate-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all group text-left"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${hoverMap[color]}`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Modals ── */}
      <PatientDashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={patientData.profile}
        appointments={patientData.appointments}
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={appointmentToReschedule}
        onReschedule={handleReschedule}
      />
      <RefillModal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        prescriptions={patientData.prescriptions}
      />
      {viewingPrescription && (
        <ViewPrescriptionModal
          prescription={viewingPrescription}
          onClose={() => setViewingPrescription(null)}
        />
      )}
      {viewingTestResult && (
        <ViewTestResultModal
          result={viewingTestResult}
          onClose={() => setViewingTestResult(null)}
          onPrint={(result) => console.log('Printing result:', result)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;