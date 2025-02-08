import React, { useState, useEffect } from "react";
import { CreateStation } from "../../Services/StationService";
import { toast } from "react-toastify";
import { Form, Button } from 'react-bootstrap';
import StationsMap from "./StationsMap";
import 'react-toastify/dist/ReactToastify.css';


const AddStation = () => {


  const [stationData, setStationData] = useState({
    name: "",
    chargerType: "",
    chargerPower: "",
    chargerAvailability: "Available",
    coordinates: { lat: "", lng: "" },
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [message, setMessage] = useState("");

  const renderErrorMessage = (field) =>
    errorMessages[field] && (
      <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages[field]}</div>
    );
  

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

  const validate = () => {
  let valid = true;
  let errors = {};

  const { name, chargerType, chargerPower, chargerAvailability, coordinates } = stationData;
  const { lat, lng } = coordinates;

  if (!name.trim()) {
    errors.name = "Name is required!";
    valid = false;
  }

  if (!chargerType.trim()) {
    errors.chargerType = "Charger type is required!";
    valid = false;
  }

  if (!chargerPower || isNaN(chargerPower) || Number(chargerPower) <= 0) {
    errors.chargerPower = "Charger power must be a positive number!";
    valid = false;
  }

  if (!["Available", "Faulted"].includes(chargerAvailability)) {
    errors.chargerAvailability = "Invalid charger availability!";
    valid = false;
  }

  if (!lat || isNaN(lat) || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be a number between -90 and 90!";
    valid = false;
  }

  if (!lng || isNaN(lng) || lng < -180 || lng > 180) {
    errors.lng = "Longitude must be a number between -180 and 180!";
    valid = false;
  }

  setErrorMessages(errors);
  return valid;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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
    <div><StationsMap/>
  
    <div className="container mt-5 ">
    <div className="row justify-content-center">
      <div className="col-md-6">
      {message && <p>{message}</p>}
      <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
  <div className="card">
    <div className="card-body">
    <h1>Add New Station</h1>
      <div className="m-2">
        <Form.Label><h2>Name</h2></Form.Label>
        <Form.Control
          type="text"
          name="name"
          defaultValue={stationData.name}
          onChange={handleChange}
        />
        {renderErrorMessage("name")}
      </div>

      <div className="m-2">
        <Form.Label><h2>Charger Type</h2></Form.Label>
        <Form.Control
          type="text"
          name="chargerType"
          defaultValue={stationData.chargerType}
          onChange={handleChange}
        />
        {renderErrorMessage("chargerType")}
      </div>

      <div className="m-2">
        <Form.Label><h2>Charger Power (kW)</h2></Form.Label>
        <Form.Control
          type="number"
          name="chargerPower"
          defaultValue={stationData.chargerPower}
          onChange={handleChange}
        />
        {renderErrorMessage("chargerPower")}
      </div>

      <div className="m-2">
        <Form.Label><h2>Charger Availability</h2></Form.Label>
        <Form.Select
          name="chargerAvailability"
          defaultValue={stationData.chargerAvailability}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="Faulted">Faulted</option>
        </Form.Select>
        {renderErrorMessage("chargerAvailability")}
      </div>

      <div className="m-2">
        <Form.Label><h2>Latitude</h2></Form.Label>
        <Form.Control
          type="number"
          step="any"
          name="lat"
          defaultValue={stationData.coordinates.lat}
          onChange={handleChange}
        />
        {renderErrorMessage("lat")}
      </div>

      <div className="m-2">
        <Form.Label><h2>Longitude</h2></Form.Label>
        <Form.Control
          type="number"
          step="any"
          name="lng"
          defaultValue={stationData.coordinates.lng}
          onChange={handleChange}
        />
        {renderErrorMessage("lng")}
      </div>

      <div className="m-2">
        <Button variant="outline-success" type="submit" className="w-100">Add Station</Button>
      </div>
    </div>
  </div>
</Form>

    </div>
    </div>
    </div>
    </div>
  );
};

export default AddStation;
