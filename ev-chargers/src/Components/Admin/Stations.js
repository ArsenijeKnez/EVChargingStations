import React, { useState } from "react";
import { CreateStation } from "../../Services/StationService";
import { toast } from "react-toastify";

const AddStation = () => {
  const [stationData, setStationData] = useState({
    name: "",
    chargerType: "",
    chargerPower: "",
    chargerAvailability: "Available",
    coordinates: { lat: "", lng: "" },
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lat" || name === "lng") {
      setStationData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value },
      }));
    } else {
      setStationData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await CreateStation(stationData);
      if(response.status === 201){
        setStationData({
          name: "",
          chargerType: "",
          chargerPower: "",
          chargerAvailability: "Available",
          coordinates: { lat: "", lng: "" },
        });
        toast.success("Station created");
      }
      else
        toast.error(response.data?.message);
    } catch (error) {
      console.error("Error adding station:", error);
      setMessage("Failed to add station. Please try again.");
    }
  };

  return (
    <div className="container mt-5 ">
    <div className="row justify-content-center">
      <div className="col-md-6">
      <h2>Add New Station</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
      <div className="card">
      <div className="card-body">
            <div className="m-2">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={stationData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="m-2">
          <label>Charger Type:</label>
          <input
            type="text"
            name="chargerType"
            value={stationData.chargerType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="m-2">
          <label>Charger Power (kW):</label>
          <input
            type="number"
            name="chargerPower"
            value={stationData.chargerPower}
            onChange={handleChange}
            required
          />
        </div>
        <div className="m-2">
          <label>Charger Availability:</label>
          <select
            name="chargerAvailability"
            value={stationData.chargerAvailability}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Faulted">Faulted</option>
          </select>
        </div>
        <div className="m-2">
          <label>Latitude:</label>
          <input
            type="number"
            step="any"
            name="lat"
            value={stationData.coordinates.lat}
            onChange={handleChange}
            required
          />
        </div>
        <div className="m-2">
          <label>Longitude:</label>
          <input
            type="number"
            step="any"
            name="lng"
            value={stationData.coordinates.lng}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        </div>
        <button type="submit">Add Station</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddStation;
