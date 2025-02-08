import React, { useState, useEffect } from "react";
import { GetStations, DeleteStation} from "../../Services/StationService";
import { stationIcon, repairingStationIcon, reservedStationIcon } from "../Assets/MapIcons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import EditStation from "./EditStation";


const StationsMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

const handleDeleteStation = async (id) => {
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

  const handleChangeStationStatus = async (id, status) => {
    //I will implement later 
  };

  return (

<div className="container mt-5 "><MapContainer 
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
                        <button onClick={() => setIsModalOpen(true)}>Edit</button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
  </MapContainer> <EditStation
          handleDeleteStation={handleDeleteStation}
          handleChangeStationStatus={handleChangeStationStatus}
          toggleModal={() => setIsModalOpen(!isModalOpen)}
          isModalOpen = {isModalOpen}
        /></div>
  );
};

export default StationsMap;
