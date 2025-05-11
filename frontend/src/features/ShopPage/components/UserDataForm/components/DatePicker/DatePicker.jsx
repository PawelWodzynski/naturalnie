import React, { useState, useRef, useEffect } from 'react';
import styles from '../../UserDataForm.module.css';
import { useDeliveryDate } from '../../../../../../context/DeliveryDateContext';

const DatePicker = () => {
  const { deliveryDate, isDateSelected, updateDeliveryDate, formatDate } = useDeliveryDate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      // Reset current month view to the selected delivery date's month
      setCurrentMonth(new Date(deliveryDate));
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    updateDeliveryDate(date);
    setShowCalendar(false);
  };

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Adjust Sunday to be 7 instead of 0
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
    }
    
    // Current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      
      // Check if this date is before today
      const isPastDate = date < today;
      
      // Check if this is the selected date
      const isSelected = 
        date.getDate() === deliveryDate.getDate() && 
        date.getMonth() === deliveryDate.getMonth() && 
        date.getFullYear() === deliveryDate.getFullYear();
      
      let className = styles.calendarDay;
      if (isSelected) className += ` ${styles.calendarDaySelected}`;
      if (isPastDate) className += ` ${styles.calendarDayDisabled}`;
      
      days.push(
        <div 
          key={i} 
          className={className}
          onClick={() => !isPastDate && handleDateSelect(date)}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleDateString('pl-PL', { month: 'long' });
  };

  return (
    <div className={styles.datePickerContainer}>
      <label className={styles.datePickerLabel}>Data dostawy:</label>
      <div className={styles.datePickerRow}>
        <div className={styles.dateDisplay}>
          {isDateSelected ? formatDate() : 'Wybierz datę dostawy'}
        </div>
        <button 
          type="button" 
          className={styles.calendarButton}
          onClick={toggleCalendar}
        >
          Kalendarz
        </button>
      </div>
      
      {showCalendar && (
        <div className={styles.calendarContainer} ref={calendarRef}>
          <div className={styles.calendarHeader}>
            <button 
              className={styles.calendarNavButton}
              onClick={handlePrevMonth}
            >
              &lt;
            </button>
            <div className={styles.calendarTitle}>
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </div>
            <button 
              className={styles.calendarNavButton}
              onClick={handleNextMonth}
            >
              &gt;
            </button>
          </div>
          
          <div className={styles.calendarGrid}>
            {/* Weekday headers */}
            <div className={styles.calendarDay}>Pn</div>
            <div className={styles.calendarDay}>Wt</div>
            <div className={styles.calendarDay}>Śr</div>
            <div className={styles.calendarDay}>Cz</div>
            <div className={styles.calendarDay}>Pt</div>
            <div className={styles.calendarDay}>Sb</div>
            <div className={styles.calendarDay}>Nd</div>
            
            {/* Calendar days */}
            {generateCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
