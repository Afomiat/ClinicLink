import React, { useState } from 'react';
import styles from './AppointmentPage.module.css';
import { Pencil, CalendarClock, Trash2, X } from 'lucide-react';

const AppointmentActionModal = ({ appointment, onClose, onEdit, onReschedule, onDelete }) => {
    const [showStatusEdit, setShowStatusEdit] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for delete confirmation
    const [newStatus, setNewStatus] = useState(appointment.status);
    const [rescheduleData, setRescheduleData] = useState({
        date: appointment.date,
        time: appointment.time
    });

    if (!appointment) return null;

    const handleStatusUpdate = () => {
        onEdit({ ...appointment, status: newStatus });
        onClose();
    };

    const handleRescheduleSubmit = () => {
        onReschedule({
            ...appointment,
            date: rescheduleData.date,
            time: rescheduleData.time
        });
        onClose();
    };

    const handleDeleteConfirm = () => {
        onDelete(appointment.id);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>
                        {showStatusEdit ? 'Edit Status' : 
                         showReschedule ? 'Reschedule Appointment' : 
                         showDeleteConfirm ? 'Confirm Deletion' : // New title for delete confirmation
                         'Choose Action'}
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {showStatusEdit ? (
                        <>
                            {/* Existing status edit UI */}
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className={styles.dropdown}
                                style={{
                                    borderColor: 
                                        newStatus === 'pending' ? '#ffeeba' :
                                        newStatus === 'completed' ? '#c3e6cb' :
                                        newStatus === 'cancelled' ? '#f5c6cb' : '#ddd',
                                    backgroundColor: 
                                        newStatus === 'pending' ? '#fff3cd' :
                                        newStatus === 'completed' ? '#d4edda' :
                                        newStatus === 'cancelled' ? '#f8d7da' : '#fff',
                                    color: 
                                        newStatus === 'pending' ? '#856404' :
                                        newStatus === 'completed' ? '#155724' :
                                        newStatus === 'cancelled' ? '#721c24' : '#000',
                                }}
                            >
                                <option value="pending" className={styles.pending}>Pending</option>
                                <option value="completed" className={styles.completed}>Completed</option>
                                <option value="cancelled" className={styles.cancelled}>Cancelled</option>
                            </select>

                            <div className={styles.buttonGroup}>
                                <button onClick={handleStatusUpdate} className={`${styles.modalActionButton} ${styles.saveEdit}`}>
                                    Save
                                </button>
                                <button onClick={() => setShowStatusEdit(false)} className={`${styles.modalActionButton} ${styles.cancelEdit}`}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : showReschedule ? (
                        <>
                            {/* Existing reschedule UI */}
                            <div className={styles.rescheduleForm}>
                                <div className={styles.formGroup}>
                                    <label>Date:</label>
                                    <input 
                                        type="date" 
                                        value={rescheduleData.date}
                                        onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                                        className={styles.dateInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Time:</label>
                                    <input 
                                        type="time" 
                                        value={rescheduleData.time}
                                        onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                                        className={styles.timeInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button onClick={handleRescheduleSubmit} className={`${styles.modalActionButton} ${styles.saveEdit}`}>
                                    Confirm 
                                </button>
                                <button onClick={() => setShowReschedule(false)} className={`${styles.modalActionButton} ${styles.cancelEdit}`}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : showDeleteConfirm ? (
                        <>
                            {/* New delete confirmation UI */}
                            <div className={styles.deleteConfirmation}>
                                <p>Are you sure you want to delete this appointment?</p>
                                <p>This action cannot be undone.</p>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button 
                                    onClick={handleDeleteConfirm} 
                                    className={`${styles.modalActionButton} ${styles.deleteConfirmButton}`}
                                >
                                    Confirm Delete
                                </button>
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)} 
                                    className={`${styles.modalActionButton} ${styles.cancelEdit}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Main action buttons */}
                            <button
                                className={styles.modalActionButton}
                                onClick={() => setShowStatusEdit(true)}
                            >
                                <Pencil size={16} /> <span>Edit Status</span>
                            </button>
                            <button
                                className={styles.modalActionButton}
                                onClick={() => setShowReschedule(true)}
                            >
                                <CalendarClock size={16} /> <span>Reschedule</span>
                            </button>
                            <button
                                className={`${styles.modalActionButton} ${styles.deleteButton}`}
                                onClick={() => setShowDeleteConfirm(true)} // Changed to show confirmation
                            >
                                <Trash2 size={16} /> <span>Delete</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentActionModal;