import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiCreditCard, FiSearch, FiFilter, 
  FiMoreVertical, FiArrowUpRight, FiCheckCircle,
  FiClock, FiAlertCircle, FiPrinter
} from 'react-icons/fi';
import jsPDF from 'jspdf';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success

  const handlePayment = () => {
    if (!paymentMethod) return;
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      // Update local state to show paid
      setPayments(prev => prev.map(p => 
        p.id === selectedInvoice.id ? { ...p, status: 'completed', transactionId: 'TX-' + Math.floor(Math.random() * 1000000), paymentMethod: paymentMethod } : p
      ));
    }, 2000);
  };

  const resetModal = () => {
    setShowPayModal(false);
    setPaymentStatus('idle');
    setPaymentMethod(null);
    setSelectedInvoice(null);
  };

  useEffect(() => {
    const mockData = [
      {
        id: 'INV-7821',
        date: '2026-04-28',
        amount: 125.50,
        service: 'Annual Checkup',
        status: 'completed',
        doctor: 'Dr. Sarah Johnson',
        paymentMethod: 'Telebirr',
        transactionId: 'TX-882910',
        patientName: 'Sarah Johnson',
        patientId: 'PT-4210'
      },
      {
        id: 'INV-7845',
        date: '2026-05-01',
        amount: 85.00,
        service: 'Lab Diagnostics',
        status: 'pending',
        doctor: 'Lab Services',
        paymentMethod: '-',
        transactionId: '-',
        patientName: 'Sarah Johnson',
        patientId: 'PT-4210'
      },
      {
        id: 'INV-7790',
        date: '2026-03-15',
        amount: 210.00,
        service: 'Cardiology Consultation',
        status: 'completed',
        doctor: 'Dr. Robert Chen',
        paymentMethod: 'CBE Birr',
        transactionId: 'TX-771023',
        patientName: 'Sarah Johnson',
        patientId: 'PT-4210'
      },
      {
        id: 'INV-7750',
        date: '2026-02-10',
        amount: 45.00,
        service: 'Prescription Refill',
        status: 'overdue',
        doctor: 'Pharmacy Dept',
        paymentMethod: '-',
        transactionId: '-',
        patientName: 'Sarah Johnson',
        patientId: 'PT-4210'
      }
    ];
    
    setTimeout(() => {
      setPayments(mockData);
      setFilteredPayments(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let results = payments.filter(p => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          p.service.toLowerCase().includes(lowerSearch) ||
          p.doctor.toLowerCase().includes(lowerSearch) ||
          p.id.toLowerCase().includes(lowerSearch)
        );
      }
      return true;
    });
    setFilteredPayments(results);
  }, [searchTerm, filter, payments]);

  const generateReceipt = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('ClinicLink Medical Center', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Payment Receipt - Official Document', 105, 28, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${payment.id}`, 20, 50);
    doc.text(`Date: ${payment.date}`, 20, 60);
    doc.text(`Patient: ${payment.patientName}`, 20, 70);
    doc.text(`Doctor/Dept: ${payment.doctor}`, 20, 80);
    doc.text(`Service: ${payment.service}`, 20, 90);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 100);
    
    doc.setFontSize(14);
    doc.text(`Total Amount: $${payment.amount.toFixed(2)}`, 20, 120);
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 130);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 140);
    
    doc.save(`Receipt_${payment.id}.pdf`);
  };

  const categories = [
    { label: 'All Invoices', value: 'all', icon: 'receipt_long' },
    { label: 'Paid', value: 'completed', icon: 'check_circle' },
    { label: 'Pending', value: 'pending', icon: 'pending' },
    { label: 'Overdue', value: 'overdue', icon: 'error' }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-lg py-lg font-inter bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface font-manrope">Payments & Billing</h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Manage your medical invoices and health insurance.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search invoice ID or service..."
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
              <h3 className="text-sm font-bold text-slate-900">Billing Filters</h3>
              <button onClick={() => {setFilter('all'); setSearchTerm('')}} className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">Reset</button>
            </div>
            
            <div className="space-y-sm p-xs">
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
          </div>

          {/* Quick Stats Sidebar */}
          <div className="bg-secondary-container/20 rounded-xl p-sm border border-secondary/10">
            <h4 className="font-bold text-sm text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              Billing Summary
            </h4>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</p>
                <p className="text-2xl font-black text-slate-900">$130.00</p>
              </div>
              <div className="pt-3 border-t border-secondary/5">
                <button className="w-full py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                  Pay All Balance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Feed */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Top Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Insurance Status</p>
                <p className="text-sm font-bold text-slate-700 italic">"Full Coverage - Aetna Platinum"</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary/5 rounded-xl flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Method</p>
                <p className="text-sm font-bold text-slate-700">Visa ending in •••• 4410</p>
              </div>
            </div>
          </div>

          <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
            Invoices & Transaction History
            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{filteredPayments.length}</span>
          </h3>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-bold uppercase tracking-widest">Accessing Secure Ledger...</p>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {filteredPayments.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      p.status === 'completed' ? 'bg-secondary/5 text-secondary' : 
                      p.status === 'pending' ? 'bg-amber-500/5 text-amber-600' : 'bg-error/5 text-error'
                    }`}>
                      <span className="material-symbols-outlined text-2xl font-light">
                        {p.status === 'completed' ? 'check_circle' : p.status === 'pending' ? 'schedule' : 'report_problem'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[16px] text-slate-900 font-bold tracking-tight">{p.service}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'completed' ? 'bg-secondary/10 text-secondary' : 
                          p.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-error/10 text-error'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{p.id}</span>
                        <span>•</span>
                        <span>{p.doctor}</span>
                        <span>•</span>
                        <span>{p.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                    <div className="text-right pr-4 border-r border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</p>
                      <p className="text-lg font-black text-slate-900">${p.amount.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {p.status === 'completed' ? (
                        <button 
                          onClick={() => generateReceipt(p)}
                          className="px-4 py-2 bg-slate-50 border border-slate-100 text-[11px] font-black text-slate-600 hover:bg-slate-100 rounded-xl transition-all uppercase tracking-widest flex items-center gap-2"
                        >
                          <FiDownload /> Receipt
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setSelectedInvoice(p); setShowPayModal(true); }}
                          className="px-5 py-2 bg-primary text-white text-[11px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                        >
                          Pay Now <FiArrowUpRight />
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-xl p-20 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">account_balance_wallet</span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No matching invoices found</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal Overlay */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[480px] flex flex-col"
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-manrope">
                      {paymentStatus === 'success' ? 'Transaction Complete' : 'Checkout'}
                    </h3>
                    <p className="text-sm text-slate-500">Invoice: {selectedInvoice?.id}</p>
                  </div>
                  {paymentStatus !== 'processing' && (
                    <button onClick={resetModal} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {paymentStatus === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="p-4 bg-slate-50 rounded-2xl mb-8 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600 uppercase">Amount Due</span>
                        <span className="text-2xl font-black text-primary">${selectedInvoice?.amount.toFixed(2)}</span>
                      </div>

                      <div className="space-y-3 flex-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Payment Method</label>
                        {[
                          { name: 'Telebirr', icon: 'mobile_friendly', color: 'bg-blue-600' },
                          { name: 'CBE Birr', icon: 'account_balance', color: 'bg-purple-600' },
                          { name: 'Credit Card', icon: 'credit_card', color: 'bg-slate-900' }
                        ].map(method => (
                          <button 
                            key={method.name} 
                            onClick={() => setPaymentMethod(method.name)}
                            className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${
                              paymentMethod === method.name ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/30 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 ${method.color} text-white rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined">{method.icon}</span>
                              </div>
                              <span className={`font-bold ${paymentMethod === method.name ? 'text-primary' : 'text-slate-700'}`}>{method.name}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              paymentMethod === method.name ? 'border-primary' : 'border-slate-200 group-hover:border-primary/50'
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full bg-primary transition-opacity ${paymentMethod === method.name ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                          </button>
                        ))}
                      </div>

                      <button 
                        disabled={!paymentMethod}
                        onClick={handlePayment}
                        className={`w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                          paymentMethod 
                            ? 'bg-primary text-white shadow-primary/30 hover:bg-primary/90' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        Confirm Payment
                      </button>
                    </motion.div>
                  )}

                  {paymentStatus === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col items-center justify-center py-12"
                    >
                      <div className="relative mb-6">
                        <div className="h-20 w-20 border-4 border-slate-100 rounded-full" />
                        <div className="absolute top-0 left-0 h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl">lock</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Processing Payment</h4>
                      <p className="text-sm text-slate-500 text-center px-8">Connecting to secure gateway. Please do not close this window.</p>
                    </motion.div>
                  )}

                  {paymentStatus === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 flex flex-col items-center justify-center py-8"
                    >
                      <div className="h-20 w-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 12 }}
                          className="material-symbols-outlined text-5xl"
                        >
                          check_circle
                        </motion.span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Payment Successful!</h4>
                      <p className="text-sm text-slate-500 mb-8 text-center px-6">
                        Invoice <span className="font-bold text-slate-700">{selectedInvoice?.id}</span> has been paid in full.
                      </p>

                      <div className="w-full space-y-3">
                        <button 
                          onClick={() => generateReceipt({ ...selectedInvoice, status: 'completed', paymentMethod: paymentMethod, transactionId: 'RECENT' })}
                          className="w-full py-3.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                        >
                          <FiDownload /> Download Receipt
                        </button>
                        <button 
                          onClick={resetModal}
                          className="w-full py-3.5 bg-secondary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;