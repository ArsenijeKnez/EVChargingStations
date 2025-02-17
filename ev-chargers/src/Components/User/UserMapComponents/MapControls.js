import React from "react";
import location from "../../../Images/Location.png";
import calendar from "../../../Images/Calendar.png";
import lookup from "../../../Images/Lookup.png";

const MapControls = ({ handleLocationClick, toggleModal, handleBestRoute, reservationDateTime, locationOn }) => (
  <div className="map-controls">
    <button
      title="Your Location"
      className={`map-button large ${locationOn ? "active" : ""}`}
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

    {reservationDateTime.length === 2 && (
      <h4 className="reservation-text">
        Looking from {reservationDateTime[0]} to {reservationDateTime[1]}
      </h4>
    )}
  </div>
);

export default MapControls;
