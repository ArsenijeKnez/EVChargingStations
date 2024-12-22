import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { GetCars, ChangeCarBattery, GetReservations } from "../../Services/UserService";
import { getRoute } from "../../Services/RouteApi";
import {getUserFromLocalStorage} from "../../Model/User";
import {getChargingTrackFromLocalStorage, ChargingTrack, updateChargingTrackInLocalStorage} from "../../Model/ChargingTrack";
import "leaflet/dist/leaflet.css";
import { stationIcon,carIcon, repairingStationIcon, reservedStationIcon } from "../Assets/MapIcons";
import positions from "../../Model/CarTrack"
import {GetStations} from "../../Services/StationService"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../Styles/ALL.css";
import DateSelector from "./UserMapComponents/DateSelection";
import MapControls from "./UserMapComponents/MapControls";


const UserMap = () => {
  const [stations, setStations] = useState([]);
  const [cars, setCars] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [travelRoute, setTravelRoute] = useState([]);  
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0); 
  const [reservedStation, setStation] = useState(0);
  const [loadedTrack, setLoadedTrack] = useState(false);
  const [parked, setParked] = useState(false);
  const [reservationDateTime, setReservationDateTime] = useState([]);  
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const expense = (selectedCar.averageConsumption / selectedCar.batteryCapacity) * 100;
      if(routs.length >= selectedCar.batteryPercentage/expense){
        toast.warning("Station is too far to reach in time");
        return;
      }

      const track = new ChargingTrack(station.stationId, routs, true, 0, selectedCar.carId);
      localStorage.setItem('chargingTrack', JSON.stringify(track));
      setTravelRoute(routs);
      setCurrentPositionIndex(0);
      setStation(station);
    }
  };

  const handleLocationClick = async () =>{
    if(selectedCar){
      if(travelRoute.length > 0){
        if(!reservedStation)
          setTravelRoute([]);
        else
          toast.info("Location must be on while charging/traveling.");
      }
      else{
        setTravelRoute(positions);
      }
    }
    else{
      toast.info("Please select a car first.");
    }
  };

  const handleCarSelection =(car)=> {
    if(!reservedStation)
      setSelectedCar(car);
    else
      toast.warning("Can't switch cars while charging");
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        const stationsResponse = await GetStations();
        setStations(stationsResponse.data);
        if (stationsResponse.data.length === 0) {
          toast.info("No stations are visible at this time");
        }
  
        const user = getUserFromLocalStorage();
        setUserId(user.id);
        const carsResponse = await GetCars(user.id);
        setCars(carsResponse.data.cars);
  
        if (!loadedTrack) {
          const storedTrack = getChargingTrackFromLocalStorage();
          if (!storedTrack) {
            setLoadedTrack(true);
            return;
          }
  
          const foundCar = carsResponse.data.cars.find(
            (car) => car.carId === storedTrack.carId
          );
          setSelectedCar(foundCar);
          setTravelRoute(storedTrack.track);
          setStation(storedTrack.stationId);
          setCurrentPositionIndex(storedTrack.positionIndex);
          setLoadedTrack(true);
        }
      } catch (err) {
        console.error("Error during initialization:", err);
      }
    };
  
    initializeData();
  }, [loadedTrack]);
  

  
  useEffect(() => {
    const handleDestinationReach = ()=> {
      if(!reservedStation){
        setCurrentPositionIndex(0);
        return;
      }
      
    }

    if(travelRoute.length > 0 && selectedCar && selectedCar.batteryPercentage !== 0){
    if (currentPositionIndex >= travelRoute.length - 1) {
      handleDestinationReach();
    }
    const interval = setInterval(() => {      
      if(!parked){
        setCurrentPositionIndex((prevIndex) => prevIndex + 1);
        const expense = (selectedCar.averageConsumption / selectedCar.batteryCapacity) * 100;
        selectedCar.batteryPercentage -= expense;
        const data = {CarId: selectedCar.carId,
                      BatteryPercentage: selectedCar.batteryPercentage
                     }
        ChangeCarBattery(data);
        updateChargingTrackInLocalStorage('positionIndex', currentPositionIndex);
      }
    }, 1000); 

    return () => clearInterval(interval); 
  }
  }, [travelRoute, currentPositionIndex, selectedCar, reservedStation, parked]);


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
            <p>Battery: {selectedCar?.batteryPercentage?.toFixed(2)}%</p>
          </div>
        )}
        {selectedCar && (travelRoute.length > 0) && (
          <div>
            <button onClick={() => setParked(!parked)}>{parked? "Resume Travel" : "Park Car"}</button>
          </div>
        )}

      </div>
      <div style={{ flex: 1 }}>
      <MapContainer center={[45.2671, 19.8335]} zoom={14} className="map-container">
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
        return stationIcon
    }
  };

  return (
    <Marker
      key={station.id}
      position={[station.coordinates.lat, station.coordinates.lng]}
      icon={getStationIcon(station.chargerAvailability)}
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
  );
})}
        {travelRoute.length > 0 && reservedStation && (<><Polyline positions={travelRoute.slice(currentPositionIndex)} color="green" />
        <Marker
            key={222}
            position={travelRoute[currentPositionIndex]}
            icon={carIcon}></Marker></>)}
      </MapContainer>
      <MapControls
          handleLocationClick={handleLocationClick}
          toggleModal={() => setIsModalOpen(!isModalOpen)}
        />

<DateSelector 
  isModalOpen={isModalOpen}
  setIsModalOpen={setIsModalOpen}
  setReservationDateTime={setReservationDateTime}
/>
      </div>
    </div>
  );
};

export default UserMap;


