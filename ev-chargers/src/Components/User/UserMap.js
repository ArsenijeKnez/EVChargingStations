import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { GetCars, ChangeCarBattery } from "../../Services/UserService";
import { getRoute } from "../../Services/RouteApi";
import {getUserFromLocalStorage} from "../../Model/User";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "../../Images/EVStation.png";
import location from "../../Images/Location.png";
import car from "../../Images/Car.png";
import positions from "../../Model/CarTrack"
import {GetStations} from "../../Services/StationService"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../Styles/ALL.css";

const carIcon = L.icon({
  iconUrl: car,
  iconSize: [32, 15],
  iconAnchor: [6, 12],
});

const customIcon = L.icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});


const UserMap = () => {
  const [stations, setStations] = useState([]);
  const [cars, setCars] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [travelRoute, setTravelRoute] = useState([]);  
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0); 
  const [reservedStation, setStation] = useState(0);

  const handleReserve = async (station) => {
    if(!currentPositionIndex || !travelRoute){
      toast.info("Location must be turned to reserve station");
      return;
    }
    if(selectedCar.chargerType !== station.chargerType){
      toast.warning("Charger types are incompatible");
      return;
    }

    const routs = await getRoute([travelRoute[currentPositionIndex][1],travelRoute[currentPositionIndex][0]], [station.coordinates.lng, station.coordinates.lat]);
    if(routs)
    {
      setTravelRoute(routs);
    }
    setStation(station);
  };
  
  const handleDestinationReach = ()=> {
    if(!reservedStation){
      setCurrentPositionIndex(0);
      return;
    }
    
  }

  const handleLocationClick = async () =>{
    if(selectedCar){
      //const start = [19.822353, 45.240025];
      //const end = [19.851402, 45.245271];
      //const routeCoordinates = await getRoute(start, end);
      if(travelRoute.length > 0){
        setTravelRoute([]);
      }
      else{
        setTravelRoute(positions);
        //setCurrentPositionIndex(0);
      }
      //console.log(routeCoordinates);
    }
    else{
      toast.info("Please select a car first.");
    }
  };

  const handleCarSelection =()=> {
    setSelectedCar(car);
  }

  useEffect(() => {
    if(travelRoute.length > 0 && selectedCar && selectedCar.batteryPercentage != 0){
    if (currentPositionIndex >= travelRoute.length - 1) {
      handleDestinationReach();
    }
    const interval = setInterval(() => {
      setCurrentPositionIndex((prevIndex) => prevIndex + 1);
      selectedCar.batteryPercentage -= 1;
      const data = {CarId: selectedCar.carId,
                    BatteryPercentage: selectedCar.batteryPercentage
                   }
      ChangeCarBattery(data);
    }, 1000); 

    return () => clearInterval(interval); 
  }
  }, [travelRoute, currentPositionIndex]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsResponse = await GetStations();
        setStations(stationsResponse.data);
        if (stationsResponse.data.length === 0) {
          toast.info("No stations are visible at this time");
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };

    const fetchCars = async () => {
      const user = getUserFromLocalStorage();
      setUserId(user.id);
      try {
        const response = await GetCars(user.id);
        setCars(response.data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchStations();
    fetchCars();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div className="mini-menu">
        <h3>Select a Car</h3>
        {cars.length === 0 ? (
          <p>No cars available.</p>
        ) : (
          <ul>
            {cars.map((car) => (
              <li
                key={car.carId}
                className={`car-item ${selectedCar && selectedCar.carId === car.carId ? "active" : ""}`}
                onClick={() => handleCarSelection(car)}
              >
                {car.model} (ID: {car.carId})
              </li>
            ))}
          </ul>
        )}
        {selectedCar && (
          <div>
            <h4>Selected Car</h4>
            <p>Battery: {selectedCar.batteryPercentage}%</p>
          </div>
        )}

      </div>
      <div style={{ flex: 1 }}>
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
                  <button onClick={() => handleReserve(station)}>
                    Reserve
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {travelRoute.length > 0 && (<><Polyline positions={travelRoute.slice(currentPositionIndex)} color="green" />
        <Marker
            key={222}
            position={travelRoute[currentPositionIndex]}
            icon={carIcon}></Marker></>)}
      </MapContainer>
      <button
  style={{
    position: "absolute",
    zIndex: 1000,
    top: "60px",
    right: "20px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  }}
  onClick={handleLocationClick}
>
  <img
    src={location}
    alt="Location Icon"
    style={{
      width: "58px",
      height: "41px",  
    }}
  />
</button>


      </div>
    </div>
  );
};

export default UserMap;


