import React, { useState, useEffect } from "react";
import { GetFaultsForStation, DismissFault } from "../../Services/AdminService";
import { toast } from "react-toastify";

const FaultsList = ({ stationId, stationName }) => {
  const [faults, setFaults] = useState([]);

  useEffect(() => {
    fetchFaults();
  }, [stationId]);

  const fetchFaults = async () => {
    try {
      const response = await GetFaultsForStation(stationId);
      setFaults(response.data);
    } catch (error) {
      toast.error("Failed to fetch faults.");
    }
  };

  const handleDismiss = async (faultId) => {
    const result = await DismissFault(faultId);
    if (result.status === 200) {
      setFaults((prevFaults) =>
        prevFaults.filter((fault) => fault.faultId !== faultId)
      );
      toast.success(result.data.messsage || "Fault dismissed.");
    } else {
      toast.error(result.data.error || "Failed to dismiss fault.");
    }
  };

  return (
    <div className="faults-container">
      <h3>Fault Reports for {stationName}</h3>
      {faults.length === 0 ? (
        <p>No faults found for this station.</p>
      ) : (
        <ul className="faults-list">
          {faults.map((fault) => (
            <li key={fault.faultId} className="fault-item">
              <strong>{fault.stationName}</strong> - {fault.description}
              <br />
              <small>{new Date(fault.faultDate).toLocaleString()}</small>
              <br />
              <small>Reported by: {fault.email}</small>
              <button
                className="dismiss-btn"
                onClick={() => handleDismiss(fault.faultId)}
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FaultsList;
