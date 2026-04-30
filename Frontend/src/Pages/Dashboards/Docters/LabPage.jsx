import React, { useState, useEffect } from 'react';
import { Pencil, Hourglass, Loader, CheckCircle2 } from 'lucide-react';
import { 
  FaVial, 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt,
  FaPrint,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import styles from './LabPage.module.css';
import LabOrderModal from './LabOrderModal';
import ViewOrderModal from './ViewOrderModal';
import UpdateOrderModal from './UpdateOrderModal';
import LabOrderActionModal from './LabOrderActionModal';

const LabPage = () => {
  const [isLabOrderModalOpen, setIsLabOrderModalOpen] = useState(false);
  const [labOrders, setLabOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
const [currentActionOrder, setCurrentActionOrder] = useState(null);
  const [ordersPerPage] = useState(4);

  useEffect(() => {
    const sampleData = [
      {
        id: 'LO-1001',
        patientName: 'John Smith',
        patientId: 'P000145',
        tests: ['CBC', 'Lipid Panel'],
        status: 'pending',
        dateOrdered: '2023-06-15',
        dateCompleted: '',
        urgency: 'routine',
        orderingPhysician: 'Dr. Emily Carter'
      },
      {
        id: 'LO-1002',
        patientName: 'Sarah Johnson',
        patientId: 'P000146',
        tests: ['Blood Glucose', 'HbA1c'],
        status: 'in-progress',
        dateOrdered: '2023-06-14',
        dateCompleted: '',
        urgency: 'urgent',
        orderingPhysician: 'Dr. Michael Brown'
      },
      {
        id: 'LO-1003',
        patientName: 'Robert Chen',
        patientId: 'P000147',
        tests: ['X-Ray Chest', 'CT Scan'],
        status: 'completed',
        dateOrdered: '2023-06-10',
        dateCompleted: '2023-06-12',
        urgency: 'routine',
        orderingPhysician: 'Dr. Emily Carter'
      },
      {
        id: 'LO-1004',
        patientName: 'Maria Garcia',
        patientId: 'P000148',
        tests: ['Urinalysis', 'Culture'],
        status: 'completed',
        dateOrdered: '2023-06-08',
        dateCompleted: '2023-06-09',
        urgency: 'stat',
        orderingPhysician: 'Dr. Lisa Wong'
      },{
        id: 'LO-1005',
        patientName: 'David Wilson',
        patientId: 'P000149',
        tests: ['Liver Function Test', 'Electrolytes'],
        status: 'pending',
        dateOrdered: '2023-06-16',
        dateCompleted: '',
        urgency: 'routine',
        orderingPhysician: 'Dr. Sarah Johnson'
      }
    ];
    setLabOrders(sampleData);
  }, []);

  const filteredOrders = labOrders.filter(order => {
    // Filter by status
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Filter by date range
    const orderDate = new Date(order.dateOrdered);
    const today = new Date();
    
    if (selectedDateRange === 'today') {
      if (orderDate.toDateString() !== today.toDateString()) return false;
    } else if (selectedDateRange === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      if (orderDate < startOfWeek) return false;
    } else if (selectedDateRange === 'month') {
      if (orderDate.getMonth() !== today.getMonth() || 
          orderDate.getFullYear() !== today.getFullYear()) return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.patientName.toLowerCase().includes(searchLower) ||
        order.patientId.toLowerCase().includes(searchLower) ||
        order.tests.some(test => test.toLowerCase().includes(searchLower)) ||
        order.id.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, selectedDateRange]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDeleteOrder = (orderId) => {
    setLabOrders(prev => prev.filter(order => order.id !== orderId));
  };
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Order: ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
              padding: 20px;
            }
            .print-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            h2 {
              margin: 0;
            }
            .section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .label {
              font-weight: bold;
            }
            .test {
              border-left: 2px solid #000;
              padding-left: 10px;
              margin: 10px 0;
            }
            .status {
              border: 1px solid #000;
              padding: 2px 6px;
              display: inline-block;
            }
            @page {
              size: auto;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Lab Order: ${order.id}</h2>
            <div>Printed: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <h3>Patient Information</h3>
            <p><span class="label">Name:</span> ${order.patientName}</p>
            <p><span class="label">Patient ID:</span> ${order.patientId}</p>
          </div>
          
          <div class="section">
            <h3>Test Information</h3>
            ${order.tests.map(test => `
              <div class="test">
                <p><strong>${test}</strong></p>
                ${order.status === 'completed' ? `
                  <p><span class="label">Result:</span> Normal <span class="label">(Reference: 0-100)</span></p>
                ` : ''}
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h3>Order Information</h3>
            <p><span class="label">Ordering Physician:</span> ${order.orderingPhysician}</p>
            <p><span class="label">Date Ordered:</span> ${new Date(order.dateOrdered).toLocaleString()}</p>
            ${order.dateCompleted ? `
              <p><span class="label">Date Completed:</span> ${new Date(order.dateCompleted).toLocaleString()}</p>
            ` : ''}
            <p><span class="label">Urgency:</span> <span class="status">${order.urgency}</span></p>
            <p><span class="label">Status:</span> <span class="status">${order.status.replace('-', ' ')}</span></p>
          </div>
          
          <div class="section">
            <h3>Special Instructions</h3>
            <p>${order.specialInstructions || 'No special instructions provided'}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 0.8em; text-align: center;">
            This is a computer-generated report. No signature is required.
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

  const handleSaveLabOrder = (newOrder) => {
    const formattedOrder = {
      id: `LO-${1000 + labOrders.length + 1}`,
      patientName: newOrder.patient.fullName,
      patientId: newOrder.patient.patientId,
      tests: newOrder.labOrders.map(test => test.testName),
      status: 'pending',
      dateOrdered: new Date().toISOString().split('T')[0],
      dateCompleted: '',
      urgency: newOrder.labOrders[0].urgency.toLowerCase(),
      orderingPhysician: 'Current User'
    };
    setLabOrders(prev => [formattedOrder, ...prev]);
  };

  const getStatusIcon = (status) => {
    const iconSize = 16;
    switch (status) {
      case 'pending':
        return <Hourglass size={iconSize} className={styles.statusPending} />;
      case 'in-progress':
        return <Loader size={iconSize} className={styles.statusInProgress} />;
      case 'completed':
        return <CheckCircle2 size={iconSize} className={styles.statusCompleted} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.labPageContainer}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <h1>
          <FaVial className={styles.headerIcon} />
          Laboratory Management
        </h1>
        <button 
          className={styles.newOrderButton}
          onClick={() => setIsLabOrderModalOpen(true)}
        >
          + New Lab Order
        </button>
      </div>

      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>Today's Orders</h3>
          <div className={styles.statValue}>
            {labOrders.filter(o => new Date(o.dateOrdered).toDateString() === new Date().toDateString()).length}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Tests</h3>
          <div className={styles.statValue}>
            {labOrders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>In Progress</h3>
          <div className={styles.statValue}>
            {labOrders.filter(o => o.status === 'in-progress').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Completed Today</h3>
          <div className={styles.statValue}>
            {labOrders.filter(o => 
              o.status === 'completed' && 
              new Date(o.dateCompleted).toDateString() === new Date().toDateString()
            ).length}
          </div>
        </div>
      </div>
      {/* Status Legend Section */}
      <div className={styles.statusLegend}>
        <div className={styles.legendItem}>
          <Hourglass size={16} className={styles.statusPending} />
          <span>Pending</span>
        </div>
        <div className={styles.legendItem}>
          <Loader size={16} className={styles.statusInProgress} />
          <span>In Progress</span>
        </div>
        <div className={styles.legendItem}>
          <CheckCircle2 size={16} className={styles.statusCompleted} />
          <span>Completed</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label>
              <FaFilter className={styles.filterIcon} />
              Filter:
            </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>
              <FaCalendarAlt className={styles.filterIcon} />
              Date Range:
            </label>
            <select 
              value={selectedDateRange} 
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >              
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders by patient, test, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>


      {/* Orders Table */}
      <div className={styles.ordersTableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient</th>
              <th>Tests</th>
              <th>Status</th>
              <th>Date Ordered</th>
              <th>Urgency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <tr key={order.id} className={styles.orderRow}>
                  <td>{order.id}</td>
                  <td>
                    <div className={styles.patientCell}>
                      <span className={styles.patientName}>{order.patientName}</span>
                      <span className={styles.patientId}>{order.patientId}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.testsCell}>
                      {order.tests.map((test, index) => (
                        <span key={index} className={styles.testBadge}>{test}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.statusCell}>
                      {getStatusIcon(order.status)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateCell}>
                      <div>{new Date(order.dateOrdered).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <span className={styles[`urgency${order.urgency}`]}>
                      {order.urgency}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionCell}>
                      <button 
                        className={styles.actionDots} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentActionOrder(order);
                          setIsActionModalOpen(true);
                        }}
                      >
                        •••
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noResults}>
                  No lab orders found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {console.log('Pagination debug:', {
  filteredOrdersLength: filteredOrders.length,
  ordersPerPage,
  shouldShowPagination: filteredOrders.length > ordersPerPage,
  currentPage,
  totalPages
})}
        {filteredOrders.length >= ordersPerPage && (
            
  <div className={styles.paginationControls}>

    
    <div className={styles.paginationButtons}>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
      >
        <FaArrowLeft /> Previous
      </button>
      
        <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
        </span>
      
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
      >
        Next <FaArrowRight />
      </button>
    </div>
  </div>
)}
      </div>

      {/* Modals */}
      <LabOrderModal
        isOpen={isLabOrderModalOpen}
        onClose={() => setIsLabOrderModalOpen(false)}
        onSave={handleSaveLabOrder}
      />

      {selectedOrder && !isUpdateModalOpen && (
        <ViewOrderModal 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateOrderModal
          order={selectedOrder}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedOrder(null);
          }}
          onSave={(updatedOrder) => {
            setLabOrders(prev => 
              prev.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
            setIsUpdateModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
      {isActionModalOpen && (
      <LabOrderActionModal
        order={currentActionOrder}
        onClose={() => setIsActionModalOpen(false)}
        onView={(order) => setSelectedOrder(order)}
        onEdit={(order) => {
          setSelectedOrder(order);
          setIsUpdateModalOpen(true);
        }}
        onPrint={handlePrintOrder}
        onDelete={handleDeleteOrder}
      />
)}
    </div>
  );
};

export default LabPage;