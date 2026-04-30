import React, { useState } from 'react'; 
import { FaTimes, FaCalendarAlt, FaClock, FaStickyNote, FaLink, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEvent, MdGroups, MdChecklist } from 'react-icons/md';
import styles from './ScheduleModal.module.css';
import { Edit, Boxes,Palette, Droplet, Brush } from "lucide-react";

const ScheduleModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [schedule, setSchedule] = useState({
    title: 'Drubble Posi',
    type: 'Event',
    date: selectedDate || new Date('2024-06-28'),
    startTime: '08:00',
    endTime: '09:00',
    note: 'Add Description',
    color: '#6366f1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(schedule);
    onClose();
  };

  if (!isOpen) return null;

  const typeOptions = [
    { value: 'Event', label: 'Event', icon: <MdEvent className={styles.optionIcon} /> },
    { value: 'Meeting', label: 'Meeting', icon: <MdGroups className={styles.optionIcon} /> },
    { value: 'Task', label: 'Task', icon: <MdChecklist className={styles.optionIcon} /> }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes className={styles.closeIcon} />
        </button>

        <h2 className={styles.title}>New Schedule</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
            <Edit className={styles.icon}/>
            Title

            </label>
            <input
              type="text"
              name="title"
              value={schedule.title}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
            <Boxes className={styles.icon} />

            Type</label>
            <div className={styles.typeOptions}>
              {typeOptions.map(option => (
                <label
                  key={option.value}
                  className={`${styles.typeOption} ${
                    schedule.type === option.value ? styles.selected : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={schedule.type === option.value}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  {option.icon}
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaCalendarAlt className={styles.icon} /> Date
              </label>
              <input
                type="date"
                name="date"
                value={schedule.date.toISOString().substring(0, 10)}
                onChange={(e) => setSchedule(prev => ({ 
                  ...prev, 
                  date: new Date(e.target.value) 
                }))} 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaClock className={styles.icon} /> Time
              </label>
              <div className={styles.timeInputs}>
                <input
                  type="time"
                  name="startTime"
                  value={schedule.startTime}
                  onChange={handleChange}
                  className={styles.timeInput}
                />
                <span className={styles.timeSeparator}>to</span>
                <input
                  type="time"
                  name="endTime"
                  value={schedule.endTime}
                  onChange={handleChange}
                  className={styles.timeInput}
                />
              </div>
            </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaStickyNote className={styles.icon} /> Note
            </label>
            <textarea
              name="note"
              value={schedule.note}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          {/* <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaLink className={styles.icon} /> Link
            </label>
            <input
              type="url"
              name="link"
              value={schedule.link}
              onChange={handleChange}
              className={styles.input}
            />
          </div> */}

          {/* <div className={styles.formGroup}>
            <label className={styles.label}>
              <FaMapMarkerAlt className={styles.icon} /> Location
            </label>
            <input
              type="text"
              name="location"
              value={schedule.location}
              onChange={handleChange}
              className={styles.input}
            />
          </div> */}

          <div className={styles.formGroup}>
            <label className={styles.label}>
            <Droplet className={styles.icon} /> Color</label>
            <div className={styles.colorOptions}>
              {['#4f46e5', '#16a34a', '#f97316', '#dc2626', '#7c3aed'].map(color => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${
                    schedule.color === color ? styles.selectedColor : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSchedule(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;