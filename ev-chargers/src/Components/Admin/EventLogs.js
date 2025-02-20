import { GetLogs, GetLogsFilterd } from "../../Services/AdminService";
import React, { useState, useEffect } from "react";

const EventLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    eventType: "",
    userId: "",
    email: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await GetLogs();
      setLogs(response.data);
    } catch (err) {
      setError("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredLogs = async () => {
    setLoading(true);
    setError("");
    filters.eventType = filters.eventType.toLowerCase();
    try {
      const response = await GetLogsFilterd(filters);
      setLogs(response.data);
    } catch (err) {
      setError("Failed to fetch filtered logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const renderLogs = () => {
    if (logs.length === 0) {
      return <p>No logs found.</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.logId}>
              <td style={{ maxWidth: 300 }}>{log.description}</td>
              <td style={{ maxWidth: 300 }}>{log.eventType}</td>
              <td style={{ maxWidth: 300 }}>
                {new Date(log.eventDate).toLocaleString()}
              </td>
              <td style={{ maxWidth: 300 }}>{log.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mt-5">
      <div className="logs-viewer">
        <h1>Logs Viewer</h1>

        <div className="filters">
          <h3>Filters</h3>
          <input
            type="text"
            name="eventType"
            placeholder="Event Type (e.g., Info)"
            value={filters.eventType}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={filters.userId}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <button onClick={fetchFilteredLogs}>Apply Filters</button>
          <button onClick={fetchLogs}>Clear Filters</button>
        </div>

        {loading ? <p className="loading">Loading...</p> : renderLogs()}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default EventLogs;
