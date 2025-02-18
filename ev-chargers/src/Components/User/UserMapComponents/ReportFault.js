import React, { useState, useEffect } from "react";
import {FaultReport} from "../../../Services/StationService"
import {getUserFromLocalStorage} from "../../../Model/User";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportFault = ({ faultedStation ,setFaultedStation}) => {
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      setDescription("");
      setErrorMessage("");
    }, [faultedStation]);

  const closeModal = () => setFaultedStation(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const length = description.trim().length
    
    if (!description || length < 10) {
      setErrorMessage("Description must have at least 10 characters.");
      return;
    }
    
    if (length > 200) {
      setErrorMessage("Description cannot have more then 200 characters.");
      return;
    }
    setErrorMessage("");

    const user = getUserFromLocalStorage();
    const email = user.email;

    const result = await FaultReport({description, email, stationId: faultedStation.stationId, stationName: faultedStation.name})
    if(result.status === 201){
      toast.success(result.message || "Fault Reported");
    }
    else
    {
      toast.error(result.message || "Failed to report faut");
    }
    closeModal();
  };

  return (
    <div>
      {faultedStation && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Report Fault in {faultedStation.name}</h2>
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label>Fault description:</label>
                <textarea
  name="description"
  value={description}
  onChange={(e) => {
    setDescription(e.target.value);
    e.target.style.height = "auto"; // Reset height to recalculate
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`; // Set max height
  }}
  style={{
    width: "100%",
    minHeight: "40px",
    maxHeight: "150px",
    overflowY: "auto",
    resize: "none", // Prevent manual resizing
  }}
  required
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

export default ReportFault;
