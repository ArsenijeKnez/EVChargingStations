import React from "react";
import location from "../../../Images/Location.png";
import calendar from "../../../Images/Calendar.png";
import lookup from "../../../Images/Lookup.png";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MapControls = ({ handleLocationClick, toggleModal, handleBestRoute, reservationDateTime, locationOn }) => (
  <div className="map-controls">
    
    {reservationDateTime.length === 2 && (
      <h3 className="reservation-text">
       From {formatDate(reservationDateTime[0])} to {formatDate(reservationDateTime[1])}
      </h3>
    )}
    {reservationDateTime.length !== 2 && (
      <h3 className="reservation-text">
        Looking at availability for the next 10min
      </h3>
    )}
    <button
      title="Your Location"
      className={`map-button ${locationOn ? "active" : ""}`}
      onClick={handleLocationClick}
    >
      <img src={location} alt="Location button" />
    </button>

    <button
      title="Lookup reservations"
      className={`map-button ${reservationDateTime.length === 2 ? "active" : ""}`}
      onClick={toggleModal}
    >
      <img src={calendar} alt="Calendar button" />
    </button>

    <button
      title="Find nearest charger"
      className="map-button"
      onClick={handleBestRoute}
    >
      <img src={lookup} alt="Best charger" />
    </button>
  </div>
);

export default MapControls;
