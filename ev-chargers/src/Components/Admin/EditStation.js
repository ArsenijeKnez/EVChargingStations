import React, { useState } from "react";

const EditStation = ({ handleDeleteStation, handleChangeStationStatus, toggleModal, isModalOpen }) => {
  const [stationId, setStationId] = useState("");
  const [status, setStatus] = useState("Available");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChangeStationStatus(stationId, status);
    toggleModal();
  };

  return (
   <div> {isModalOpen && (<div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Station</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="stationId">Station ID:</label>
            <input
              type="text"
              id="stationId"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="status">Change Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Faulted">Faulted</option>
            </select>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit">Apply</button>
            <button
              type="button"
              onClick={() => handleDeleteStation(stationId)}
            >
              Delete
            </button>
            <button type="button" onClick={toggleModal} >Cancel</button>
          </div>
        </form>
      </div>
    </div>)}
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
  

export default EditStation;
