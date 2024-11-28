import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "../Images/EVStation.png";
import {GetStationsGuest} from "../Services/StationService"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customIcon = L.icon({
  iconUrl: icon, 
  iconSize: [30, 30], 
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30], 
});

const Map = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsForGuest = await GetStationsGuest();
        setStations(stationsForGuest.data); 
        if(stationsForGuest.data.length === 0){
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
        <Marker key={station.id} position={[station.coordinates.lat, station.coordinates.lng]} icon={customIcon} >
          <Popup>{station.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
