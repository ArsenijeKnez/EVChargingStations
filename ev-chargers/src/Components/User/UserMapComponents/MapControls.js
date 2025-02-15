import location from "../../../Images/Location.png";
import calendar from "../../../Images/Calendar.png";
import lookup from "../../../Images/Lookup.png"

const MapControls = ({ handleLocationClick, toggleModal, handleBestRoute }) => (
    <>
      <button
        title="Your Location"
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "60px",
          right: "10px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleLocationClick}
      >
        <img
          src={location}
          alt="Location button"
          style={{ width: "58px", height: "41px" }}
        />
      </button>
      <button
        title="Lookup reservations"
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "60px",
          right: "80px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={toggleModal}
      >
        <img
          src={calendar}
          alt="Calendar button"
          style={{ width: "41px", height: "41px" }}
        />
      </button>
      <button
        title="Find nearest charger"
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "60px",
          right: "140px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleBestRoute}
      >
        <img
          src={lookup}
          alt="Best charger"
          style={{ width: "41px", height: "41px" }}
        />
      </button>
    </>
  );
  export default MapControls;