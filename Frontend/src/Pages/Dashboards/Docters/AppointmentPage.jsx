import React, { useEffect, useState } from 'react';
import styles from './AppointmentPage.module.css';
import CircleProgress from './CircleProgress';
import { Funnel, MagnifyingGlass, X, Check } from 'phosphor-react';
import AddAppointmentModal from './AddAppointmentModal';
import AppointmentActionModal from './AppointmentActionModal';
import api from './Doc_Api/Dashboard_api';

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ total: 0, pending: 0, completed: 0 });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentsTableData, setAppointmentsTableData] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'all',
        date: '',
        treatment: ''
    });
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.getAppointments();
                const appointmentsData = response.data;
                
                setAppointments(appointmentsData);
                setAppointmentsTableData(appointmentsData);
                
                // Calculate summary statistics
                const total = appointmentsData.length;
                const pending = appointmentsData.filter(a => a.status === 'pending').length;
                const completed = appointmentsData.filter(a => a.status === 'completed').length;
                
                setSummary({
                    total,
                    pending,
                    completed
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments = appointmentsTableData.filter(appointment => {
        const searchTermLower = filters.searchTerm.toLowerCase();
        return (
            (filters.searchTerm === '' || 
             appointment.id.toLowerCase().includes(searchTermLower) || 
             appointment.patientName.toLowerCase().includes(searchTermLower)) &&
            (filters.status === 'all' || appointment.status === filters.status) &&
            (filters.date === '' || appointment.date === filters.date) &&
            (filters.treatment === '' || 
             appointment.treatment.toLowerCase().includes(filters.treatment.toLowerCase()))
        );
    });

    
    // State for appointments table
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleOpenActionModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowActionModal(true);
    };
    
    const handleAddAppointment = (newAppointment) => {
        setAppointments(prev => [...prev, newAppointment]);
        setAppointmentsTableData(prev => [...prev, newAppointment]);
        setSummary(prev => ({
            ...prev,
            total: prev.total + 1,
            pending: prev.pending + (newAppointment.status === 'pending' ? 1 : 0),
            completed: prev.completed + (newAppointment.status === 'completed' ? 1 : 0)
        }));
    };

    const handleDeleteAppointment = (appointmentId) => {
        const deletedAppointment = [...appointments, ...appointmentsTableData]
            .find(appt => appt.id === appointmentId);
        
        setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
        setAppointmentsTableData(prev => prev.filter(appt => appt.id !== appointmentId));
        
        setSummary(prev => {
            const newSummary = {
                ...prev,
                total: prev.total - 1
            };
            
            if (deletedAppointment?.status === 'completed') {
                newSummary.completed = prev.completed - 1;
            } else if (deletedAppointment?.status === 'pending') {
                newSummary.pending = prev.pending - 1;
            }
            
            return newSummary;
        });
        
        setShowActionModal(false);
        
        const newTotalPages = Math.ceil((appointmentsTableData.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
        }
    };

    const handleEditAppointment = (updatedAppointment) => {
        setAppointmentsTableData(prev =>
            prev.map(appointment =>
                appointment.id === updatedAppointment.id ? updatedAppointment : appointment
            )
        );
        setAppointments(prev =>
            prev.map(appointment =>
                appointment.id === updatedAppointment.id ? updatedAppointment : appointment
            )
        );
        
        if (updatedAppointment.status !== selectedAppointment?.status) {
            setSummary(prev => {
                const newSummary = {...prev};
                
                if (selectedAppointment?.status === 'completed') {
                    newSummary.completed--;
                } else if (selectedAppointment?.status === 'pending') {
                    newSummary.pending--;
                }
                
                if (updatedAppointment.status === 'completed') {
                    newSummary.completed++;
                } else if (updatedAppointment.status === 'pending') {
                    newSummary.pending++;
                }
                
                return newSummary;
            });
        }
    };

    const handleReschedule = (updatedAppointment) => {
        setAppointmentsTableData(prev =>
            prev.map(appointment =>
                appointment.id === updatedAppointment.id ? updatedAppointment : appointment
            )
        );
        setAppointments(prev =>
            prev.map(appointment =>
                appointment.id === updatedAppointment.id ? updatedAppointment : appointment
            )
        );
    };
    
    const handleAccept = (id) => {
        console.log(`Accepted appointment ${id}`);
    };

    const handleReject = (id) => {
        console.log(`Rejected appointment ${id}`);
    };

    const generateCalendarDays = () => {
        const days = [];
        const today = new Date(currentDate);
        const currentDay = today.getDate();
        
        today.setDate(currentDay - today.getDay());
        
        for (let i = 0; i < 14; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            days.push({
                date: day.getDate(),
                isToday: day.toDateString() === new Date().toDateString(),
                isCurrentMonth: day.getMonth() === currentDate.getMonth()
            });
        }
        
        return days;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const calendarDays = generateCalendarDays();
    const generateRandomAvatar = (seed) => 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    useEffect(() => {
        async function fetchAppointments() {
            try {
              const appointmentsWithImages = [
                {
                  id: "APT001",
                  patientName: "Mickel Howard",
                  date: "2023-06-15",
                  time: "10:00 AM",
                  gender: "Male",
                  age: 38,
                  treatment: "Regular checkup",
                  status: "canceled",
                  image: generateRandomAvatar("MickelHoward")
                },
                {
                  id: "APT002",
                  patientName: "Sebastian Lee",
                  date: "2023-06-16",
                  time: "02:30 PM",
                  gender: "Male",
                  age: 38,
                  treatment: "Regular checkup",
                  status: "pending",
                  image: generateRandomAvatar("SebastianLee")
                },
                {
                  id: "APT003",
                  patientName: "Nazra Khan",
                  date: "2023-06-17",
                  time: "11:15 AM",
                  gender: "Female",
                  age: 24,
                  treatment: "Root Cleaning",
                  status: "completed",
                  image: generateRandomAvatar("NazraKhan")
                },
                {
                  id: "APT004",
                  patientName: "Mr. Kennedy",
                  date: "2023-06-18",
                  time: "09:45 AM",
                  gender: "Male",
                  age: 48,
                  treatment: "Teeth Removing",
                  status: "pending",
                  image: generateRandomAvatar("MrKennedy")
                },
                {
                  id: "APT005",
                  patientName: "Sarah Johnson",
                  date: "2023-06-19",
                  time: "03:00 PM",
                  gender: "Female",
                  age: 32,
                  treatment: "Dental Filling",
                  status: "completed",
                  image: generateRandomAvatar("SarahJohnson")
                },
                {
                  id: "APT006",
                  patientName: "Emma Watson",
                  date: "2023-06-20",
                  time: "10:30 AM",
                  gender: "Female",
                  age: 28,
                  treatment: "Teeth Whitening",
                  status: "pending",
                  image: generateRandomAvatar("EmmaWatson")
                },
                {
                  id: "APT007",
                  patientName: "David Miller",
                  date: "2023-06-21",
                  time: "01:15 PM",
                  gender: "Male",
                  age: 45,
                  treatment: "Dental Crown",
                  status: "completed",
                  image: generateRandomAvatar("DavidMiller")
                },
                {
                  id: "APT008",
                  patientName: "Lisa Ray",
                  date: "2023-06-22",
                  time: "04:45 PM",
                  gender: "Female",
                  age: 31,
                  treatment: "Braces Consultation",
                  status: "pending",
                  image: generateRandomAvatar("LisaRay")
                },
                {
                  id: "APT009",
                  patientName: "Robert Chen",
                  date: "2023-06-23",
                  time: "11:00 AM",
                  gender: "Male",
                  age: 52,
                  treatment: "Denture Fitting",
                  status: "completed",
                  image: generateRandomAvatar("RobertChen")
                },
                {
                  id: "APT010",
                  patientName: "Olivia Martinez",
                  date: "2023-06-24",
                  time: "02:00 PM",
                  gender: "Female",
                  age: 29,
                  treatment: "Gum Treatment",
                  status: "pending",
                  image: generateRandomAvatar("OliviaMartinez")
                }
              ];
          
              setAppointments(appointmentsWithImages);
              setAppointmentsTableData(appointmentsWithImages);
              setSummary({
                total: appointmentsWithImages.length,
                pending: appointmentsWithImages.filter(a => a.status === 'pending').length,
                completed: appointmentsWithImages.filter(a => a.status === 'completed').length
              });
              setLoading(false);
            } catch (error) {
              console.error("Error fetching appointments:", error);
              setLoading(false);
            }
          }
    
        fetchAppointments();
      }, []);
    
    if (loading) {
        return <div className={styles.container}>Loading appointments...</div>;
    }

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        setShowFilterModal(false);
    };

    return (
        <>  
            {showActionModal && selectedAppointment && (
                <AppointmentActionModal
                    appointment={selectedAppointment}
                    onClose={() => setShowActionModal(false)}
                    onEdit={handleEditAppointment}
                    onReschedule={handleReschedule}
                    onDelete={handleDeleteAppointment}
                />
            )}

            {showModal && (
                <AddAppointmentModal
                    onClose={() => setShowModal(false)}
                    onAddAppointment={handleAddAppointment}
                />
            )}

            {showFilterModal && (
                <div className={styles.filterModalOverlay}>
                    <div className={styles.filterModal}>
                        <div className={styles.filterModalHeader}>
                            <h3>Advanced Filters</h3>
                            <button 
                                onClick={() => setShowFilterModal(false)}
                                className={styles.closeFilterModal}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.filterModalContent}>
                            <div className={styles.filterGroup}>
                                <label>Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                                    className={styles.filterSelect}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                                    className={styles.dateInput}
                                />
                            </div>

                            
                        </div>
                        <div className={styles.filterModalFooter}>
                        <button
                            onClick={() => setFilters({
                                searchTerm: '',
                                status: 'all',
                                date: '',
                                treatment: ''
                            })}
                            className={styles.clearFiltersButton}
                        >
                            Clear
                        </button>
                            <button
                                onClick={() => applyFilters(filters)}
                                className={styles.applyFiltersButton}
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.AddApoint}>
                <p>Add appointment in your schedule now</p>
                <button className={styles.addBut} onClick={() => setShowModal(true)}>+Add Appointment</button>
            </div>

            <div className={styles.statsContainer}>
                <div className={styles.circleBox}><CircleProgress value={summary.total} label="Total Appointments" color="#007bff" /></div>
                <div className={styles.circleBox}><CircleProgress value={summary.pending} label="Pending" color="#ffc107" /></div>
                <div className={styles.circleBox}><CircleProgress value={(summary.completed / summary.total) * 100 || 0} label="Completed" color="#28a745" /></div>
            </div>

            {/* Calendar Section */}
            <div className={styles.calendarContainer}>
                <div className={styles.calendarTitle}>Calendar</div>
                <div className={styles.calendarHeader}>
                    <div className={styles.calanderBut}>
                        <button 
                            className={styles.navButton}
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                newDate.setDate(newDate.getDate() - 14);
                                setCurrentDate(newDate);
                            }}
                        >
                            &lt;
                        </button>
                        <h3>
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button 
                            className={styles.navButton}
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                newDate.setDate(newDate.getDate() + 14);
                                setCurrentDate(newDate);
                            }}
                        >
                            &gt;
                        </button>
                    </div>
                    
                    <table className={styles.calendarTable}>
                        <thead>
                            <tr>
                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {calendarDays.map((day, index) => (
                                    <td 
                                        key={index} 
                                        className={`${day.isToday ? styles.today : ''} ${!day.isCurrentMonth ? styles.otherMonth : ''}`}
                                    >
                                        {day.date}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Appointments Table Section */}
            <div className={styles.appointmentsTableContainer}>
                <div className={styles.tableHeader}>
                    <h2>Appointments</h2>
                    <div className={styles.tableControls}>
                        <div className={styles.filterSection}>
                            <div className={styles.searchBar}>
                                <MagnifyingGlass size={18} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                                    className={styles.searchInput}
                                />
                                {filters.searchTerm && (
                                    <button 
                                        onClick={() => setFilters({...filters, searchTerm: ''})}
                                        className={styles.clearSearch}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className={styles.filterControls}>
                                <button
                                    className={`${styles.filterButton} ${Object.values(filters).some(val => val !== '' && val !== 'all') ? styles.active : ''}`}
                                    onClick={() => setShowFilterModal(true)}
                                >
                                    <Funnel size={16} />
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <table className={styles.appointmentsTable}>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.id}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${
                                        appointment.status === 'completed' ? styles.completed :
                                        appointment.status === 'pending' ? styles.pending :
                                        styles.cancelled
                                    }`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className={styles.actionDots} 
                                        onClick={() => handleOpenActionModal(appointment)}
                                    >
                                        •••
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Original Appointment Requests Container */}
            <div className={styles.Appointcontainer}>
                <h1 className={styles.title}>Appointment Requests</h1>
                <div className={styles.Hline}></div>

                <div className={styles.appointmentsContainer}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        appointments
                        .filter(appointment => appointment.status === 'pending')
                        .map((appointment) => (
                            <div key={appointment.id} className={styles.appointmentCard}>
                                <div className={styles.cardHeader}>
                                    <img 
                                        src={appointment.image} 
                                        alt={appointment.name} 
                                        className={styles.avatar}
                                    />
                                    <h2 className={styles.patientName}>{appointment.patientName}</h2>
                                </div>
                                <div className={styles.cardContent}>
                                    <p className={styles.patientInfo}>
                                        {appointment.gender}, {appointment.age}<br />
                                        <span className={styles.treatment}>Treatment - {appointment.treatment}</span>
                                    </p>
                                    
                                    <div className={styles.actionButtons}>
                                        <button 
                                            className={styles.acceptButton}
                                            onClick={() => handleAccept(appointment.id)}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className={styles.rejectButton}
                                            onClick={() => handleReject(appointment.id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}