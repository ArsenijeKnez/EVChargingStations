import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "../../Images/EVStation.png";
import {GetStations} from "../../Services/StationService"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../Styles/ALL.css";

const customIcon = L.icon({
  iconUrl: icon, 
  iconSize: [30, 30], 
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30], 
});


const handleReserve = (stationId) => {
    console.log("a");
  };
  
const UserMap = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsResponse= await GetStations();
        setStations(stationsResponse.data); 
        if(stationsResponse.data.length === 0){
          toast.info("No stations are visible at this time");}
      } catch (err) {
        console.error("Error fetching stations:", err); 
      }
    };

    fetchStations();
  }, []); 


  return (
    <MapContainer center={[45.2671, 19.8335]} zoom={14} className="map-container">
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  {stations.map((station) => (
    <Marker
      key={station.id}
      position={[station.coordinates.lat, station.coordinates.lng]}
      icon={customIcon}
    >
      <Popup>
        <div>
          <h3>{station.name}</h3>
          <p><strong>Charger Type:</strong> {station.chargerType}</p>
          <p><strong>Charger Power:</strong> {station.chargerPower} kW</p>
          <p><strong>Availability:</strong> {station.chargerAvailability}</p>
          {station.chargerAvailability === "Available" && (
            <button
              onClick={() => handleReserve(station.id)}
            >
              Reserve
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  ))}
</MapContainer>

  );
};

export default UserMap;
