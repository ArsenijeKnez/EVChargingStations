import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { GetCars, ChangeCarBattery, Reserve } from "../../Services/UserService";
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
  const [selectedCar, setSelectedCar] = useState(null);
  const [locationOn, setLocationOn] = useState(false);

  const [chargingTrack, setChargingTrack] = useState(new ChargingTrack(-1, positions, true, 0, -1));
  const [reservation, setReservation] = useState(null);

  const [reservationDateTime, setReservationDateTime] = useState([]);  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserve = async (station) => {
    if(reservation){
      toast.info("User cannot have two reservations");
      return;
    }
    if(!locationOn){
      toast.info("Location must be turned to reserve station");
      return;
    }
    if(selectedCar.chargerType !== station.chargerType){
      toast.warning("Charger types are incompatible");
      return;
    }

    const routs = await getRoute([chargingTrack.travelRoute[chargingTrack.currentPositionIndex][1],chargingTrack.travelRoute[chargingTrack.currentPositionIndex][0]], [station.coordinates.lng, station.coordinates.lat]);
    if(routs)
    {
       const expense = (selectedCar.averageConsumption / selectedCar.batteryCapacity) * 100;
       if(routs.length >= selectedCar.batteryPercentage/expense){
         toast.warning("Station is too far to reach in time, try charging somewhere closer");
         return;
       }
       const user = getUserFromLocalStorage();
      const response = await Reserve({Email: user.email, CarID: selectedCar.carId, StationID: station.stationId, Start: reservationDateTime[0], End: reservationDateTime[1]});

      if (response.status === 201) {
        const data = await response.data.reservation;
        setReservation(data);
        toast.success('Reserved station');
      } else {
        const errorMessage = await response.data.message;
        toast.error(errorMessage);
        return;
      }

      if(reservationDateTime.length !== 2){
        const track = new ChargingTrack(station.stationId, routs, false, 0, selectedCar.carId);
        localStorage.setItem('chargingTrack', JSON.stringify(track));
        setChargingTrack(track);
      }
    }
  };

  const handleLocationClick = async () =>{
    if(selectedCar){
      setLocationOn(!locationOn);
    }
    else{
      toast.info("Please select a car first.");
    }
  };

  const handleCarSelection =(car)=> {
    if(chargingTrack.reservedStation === -1)
      setSelectedCar(car);
    else
      toast.warning("Can't switch cars while charging");
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("aa");
        const stationsResponse = await GetStations();
        setStations(stationsResponse.data);
        if (stationsResponse.data.length === 0) {
          toast.info("No stations are visible at this time");
        }
  
        const user = getUserFromLocalStorage();
        const carsResponse = await GetCars(user.id);
        setCars(carsResponse.data.cars);

          const storedTrack = getChargingTrackFromLocalStorage();
          if (!storedTrack) {
            return;
          }
          
          const foundCar = carsResponse.data.cars.find(
            (car) => car.carId === storedTrack.carId
          );
          setSelectedCar(foundCar);
          setChargingTrack(storedTrack);
          

      } catch (err) {
        console.error("Error during initialization:", err);
      }
    };
  
    initializeData();
  }, []);
  

  
  useEffect(() => {
    const handleDestinationReach = () => {
      setChargingTrack(prevState => ({
        ...prevState,
        isParked: true,
      }));
      updateChargingTrackInLocalStorage('isParked', true);
    };
  
    if (
      chargingTrack.travelRoute.length > 0 &&
      selectedCar &&
      selectedCar.batteryPercentage > 0
    ) {
      if (chargingTrack.currentPositionIndex >= chargingTrack.travelRoute.length - 1) {
        handleDestinationReach();
        return; 
      }
  
      const interval = setInterval(() => {
        if (!chargingTrack.isParked) {
          setChargingTrack(prevState => {
            const updatedIndex = prevState.currentPositionIndex + 1;
            updateChargingTrackInLocalStorage('currentPositionIndex', updatedIndex);
            return {
              ...prevState,
              currentPositionIndex: updatedIndex,
            };
          });
  
          const expense = (selectedCar.averageConsumption / selectedCar.batteryCapacity) * 100;
          selectedCar.batteryPercentage = Math.max(0, selectedCar.batteryPercentage - expense);
  
          ChangeCarBattery({
            CarId: selectedCar.carId,
            BatteryPercentage: selectedCar.batteryPercentage,
          });
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [chargingTrack.isParked, chargingTrack.currentPositionIndex,chargingTrack.travelRoute.length, selectedCar]); 
  

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
        {selectedCar && (chargingTrack.travelRoute.length > 0) && (
          <div>
            <button onClick={() =>  {setChargingTrack(prevState => ({ ...prevState, isParked: !chargingTrack.isParked,}));  updateChargingTrackInLocalStorage('isParked', true);}}>
              {chargingTrack.isParked? "Resume Travel" : "Park Car"}</button>
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
        {locationOn && (chargingTrack.reservedStation !== -1) && <Polyline positions={chargingTrack.travelRoute.slice(chargingTrack.currentPositionIndex)} color="green" />}
        {locationOn && (
        <Marker
            key={222}
            position={chargingTrack.travelRoute[chargingTrack.currentPositionIndex]}
            icon={carIcon}></Marker>)}
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


