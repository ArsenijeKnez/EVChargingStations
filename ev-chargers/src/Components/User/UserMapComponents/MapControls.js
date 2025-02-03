import location from "../../../Images/Location.png";
import calendar from "../../../Images/Calendar.png";

const MapControls = ({ handleLocationClick, toggleModal }) => (
    <>
      <button
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
    </>
  );
  export default MapControls;