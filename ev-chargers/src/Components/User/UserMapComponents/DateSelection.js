import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ isModalOpen, setIsModalOpen, setReservationDateTime }) => {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!startDateTime || !endDateTime) {
      setErrorMessage("All fields are required.");
      return;
    }
    
    if (startDateTime >= endDateTime) {
      setErrorMessage("Start date and time must be before end date and time.");
      return;
    }
    setErrorMessage("");

    setReservationDateTime([startDateTime.toISOString(), endDateTime.toISOString()]);
    closeModal();
  };

  return (
    <div>
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Time of Reservation</h2>
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label>Select Start Date & Time:</label>
                <DatePicker
                  selected={startDateTime}
                  onChange={(date) => setStartDateTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select start date and time"
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Select End Date & Time:</label>
                <DatePicker
                  selected={endDateTime}
                  onChange={(date) => setEndDateTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select end date and time"
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>Apply</button>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  submitButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default DateSelector;
