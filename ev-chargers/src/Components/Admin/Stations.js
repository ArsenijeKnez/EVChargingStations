import React, { useState, useEffect } from "react";
import { CreateStation ,GetStations, DeleteStation} from "../../Services/StationService";
import { toast } from "react-toastify";
import { Form, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'react-toastify/dist/ReactToastify.css';
import { stationIcon, repairingStationIcon, reservedStationIcon } from "../Assets/MapIcons";



const AddStation = () => {

  
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stations = await GetStations();
        setStations(stations.data); 
        if(stations.data.length === 0){
          toast.info("No stations are visible at this time");}
      } catch (err) {
        console.error("Error fetching stations:", err); 
      }
    };

    fetchStations();
  }, []); 


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

  const handleDelete = async (id) => {
    try {
      const response = await DeleteStation(id);
      if (response.status === 200) {  
        setStations(stations.filter(station => station.stationId !== id));
        toast.success("Station deleted successfully");
      } else {
        toast.error("Failed to delete station");
      }
    } catch (error) {
      console.error("Error deleting station:", error);
      toast.error("Failed to delete station");
    }
  };

  return (
    <div><div className="container mt-5 "><MapContainer 
    center={[45.2671, 19.8335]} 
    zoom={14} 
    style={{ width: '70%', height: '600px', justifySelf: 'center' , borderRadius: 10, border: '2px solid #228B22'}} 
    className="map-container"
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    {stations.map((station) => {
                
                const getStationIcon = (availability) => {
                  switch (availability) {
                    case "Available":
                      return stationIcon;
                    case "Occupied":
                      return reservedStationIcon;
                    case "Faulted":
                      return repairingStationIcon;
                    default:
                      return stationIcon;
                  }
                };
      
                return (
                  <Marker
                    key={station.stationId}
                    position={[station.coordinates.lat, station.coordinates.lng]}
                    icon={getStationIcon(station.chargerAvailability)}
                  >
                    <Popup>
                      <div>
                        <h3>{station.name}</h3>
                        <p>
                          <strong>Charger Type:</strong> {station.chargerType}
                        </p>
                        <p>
                          <strong>Charger Power:</strong> {station.chargerPower} kW
                        </p>
                        <p>
                          <strong>Availability:</strong>{" "}
                          {station.chargerAvailability}
                        </p>
                        <button onClick={() => handleDelete(station.stationId)}>Delete Station</button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
  </MapContainer></div>
  
    <div className="container mt-5 ">
    <div className="row justify-content-center">
      <div className="col-md-6">
      {message && <p>{message}</p>}
      <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
  <div className="card">
    <div className="card-body">
    <h2>Add New Station</h2>
      <div className="m-2">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          defaultValue={stationData.name}
          onChange={handleChange}
        />
        {renderErrorMessage("name")}
      </div>

      <div className="m-2">
        <Form.Label>Charger Type</Form.Label>
        <Form.Control
          type="text"
          name="chargerType"
          defaultValue={stationData.chargerType}
          onChange={handleChange}
        />
        {renderErrorMessage("chargerType")}
      </div>

      <div className="m-2">
        <Form.Label>Charger Power (kW)</Form.Label>
        <Form.Control
          type="number"
          name="chargerPower"
          defaultValue={stationData.chargerPower}
          onChange={handleChange}
        />
        {renderErrorMessage("chargerPower")}
      </div>

      <div className="m-2">
        <Form.Label>Charger Availability</Form.Label>
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
        <Form.Label>Latitude</Form.Label>
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
        <Form.Label>Longitude</Form.Label>
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
        <Button variant="success" type="submit">Add Station</Button>
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
