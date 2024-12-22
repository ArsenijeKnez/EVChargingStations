import React, {useState} from "react";

const DateSelector = ({
    isModalOpen,
    setIsModalOpen,
    setReservationDateTime
  }) => {
  const [selectedTimeStart, setSelectedTimeStart] = useState("");
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("");
  const [selectedDateStart, setSelectedDateStart] = useState("");
  const [selectedDateEnd, setSelectedDateEnd] = useState("");


  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = `${selectedDateStart} ${selectedTimeStart}`;
    const endDateTime = `${selectedDateEnd} ${selectedTimeEnd}`;

    setReservationDateTime([startDateTime, endDateTime]);
    closeModal();
  };
  

  return (
    <div>

      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Time of reservation</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label htmlFor="date">Select Start Date:</label><br/>
                <input
                  type="date"
                  id="datestart"
                  value={selectedDateStart}
                  onChange={(e) => setSelectedDateStart(e.target.value)}
                  required
                />
                <label htmlFor="time">Select Start Time:</label><br/>
                <input
                  type="time"
                  id="timestart"
                  value={selectedTimeStart}
                  onChange={(e) => setSelectedTimeStart(e.target.value)}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="date">Select End Date:</label><br/>
                <input
                  type="date"
                  id="dateend"
                  value={selectedDateEnd}
                  onChange={(e) => setSelectedDateEnd(e.target.value)}
                  required
                />
                <label htmlFor="time">Select End Time:</label><br/>
                <input
                  type="time"
                  id="timeend"
                  value={selectedTimeEnd}
                  onChange={(e) => setSelectedTimeEnd(e.target.value)}
                  required
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>Submit</button>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
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
};

export default DateSelector;
