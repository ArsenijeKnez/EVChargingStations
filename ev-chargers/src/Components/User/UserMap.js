import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { GetCars, ChangeCarBattery, Reserve, GetReservation, GetReservations, EndReservation, ActivateReservation} from "../../Services/UserService";
import { getRoute } from "../../Services/RouteApi";
import {getUserFromLocalStorage} from "../../Model/User";
import {getChargingTrackFromLocalStorage, ChargingTrack, updateChargingTrackInLocalStorage} from "../../Model/ChargingTrack";
import "leaflet/dist/leaflet.css";
import { stationIcon,carIcon, repairingStationIcon, reservedStationIcon, userStationIcon } from "../Assets/MapIcons";
import positions from "../../Model/CarTrack"
import {GetStations} from "../../Services/StationService"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateSelector from "./UserMapComponents/DateSelection";
import MapControls from "./UserMapComponents/MapControls";


const UserMap = () => {
  const [stations, setStations] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [locationOn, setLocationOn] = useState(false);
  const [chargingTrack, setChargingTrack] = useState(new ChargingTrack(positions, true, 0, -1));
  const [reservation, setReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationDateTime, setReservationDateTime] = useState([]);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

  const postReserve = async (station) => {
    const user = getUserFromLocalStorage();
    const response = await Reserve({Email: user.email, CarID: selectedCar.carId, StationID: station.stationId, Start: reservationDateTime[0], End: reservationDateTime[1]});

    if (response.status === 201) {
      const data = await response.data;
      setReservation(data);
      toast.success('Reserved station');
      return true;
    } else {
      const errorMessage = await response.data.message;
      toast.error(errorMessage);
      return false;
    }
  };

  const handleTravelTo = async (station) => {
    

    if(!locationOn){
      toast.info("Location must be turned on to reserve station");
      return;
    }
    const routs = await getRoute([chargingTrack.travelRoute[chargingTrack.currentPositionIndex][1],chargingTrack.travelRoute[chargingTrack.currentPositionIndex][0]], [station.coordinates.lng, station.coordinates.lat]);
    if(!routs)
    {
      toast.error("Cannot find path to the station.");
      return;
    }
    const track = new ChargingTrack(routs, false, 0, selectedCar.carId);
    localStorage.setItem('chargingTrack', JSON.stringify(track));
    setChargingTrack(track);                                

  };

  const handleReserve = async (station) => {
    if(reservation){
      toast.info("User cannot have two reservations");
      return;
    }
    await postReserve(station);
    initializeData();
    
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
    if(!isCharging)
      setSelectedCar(car);
    else
      toast.warning("Can't switch cars while charging");
  }

  const handleCancelReservation = async () =>{
    const user = getUserFromLocalStorage();
    EndReservation({Email: user.email});
    setReservation(null);
    setIsCharging(false);
  }

  useEffect(() => {
    if(reservationDateTime.length === 2){
    const response = GetReservations(reservationDateTime[0], reservationDateTime[1]);
    if(response.status === 200){
      setReservations(response.data.reservations);
    }
    }
  }, [reservationDateTime]);

  useEffect(() => {
    if (reservation) {
      const interval = setInterval(() => {
        const now = new Date();
        const reservationEndTime = new Date(reservation.end);
  
        if (now >= reservationEndTime) {
          setReservation(null);
          setIsCharging(false);
        }
      }, 10000); 
  
      return () => clearInterval(interval);
    }
  }, [reservation]);

  const initializeData = async () => {
    try {
      const stationsResponse = await GetStations();
      setStations(stationsResponse.data);
      if (stationsResponse.data.length === 0) {
        toast.info("No stations are visible at this time");
      }

      const user = getUserFromLocalStorage();
      const carsResponse = await GetCars(user.id);
      setCars(carsResponse.data.cars);

      const storedTrack = getChargingTrackFromLocalStorage();
      if (storedTrack) {
        const foundCar = carsResponse.data.cars.find(
          (car) => car.carId === storedTrack.carId
        );
        setSelectedCar(foundCar);
        setChargingTrack(storedTrack);
      }
      
      const reservationResponse = await GetReservation(user.email);
      if(reservationResponse.status === 200 && reservationResponse.data.reservation && reservationResponse.data.reservation.length !== 0){
        setReservation(reservationResponse.data.reservation);
        const foundCar = carsResponse.data.cars.find(
          (car) => car.carId === reservationResponse.data.reservation.carId
        );
        setSelectedCar(foundCar);
      }
        
    } catch (err) {
      console.error("Error during initialization:", err);
    }
  };


  useEffect(() => {
    
    initializeData();
  }, []);


    const handleStartCharging = async () => {
          const user = getUserFromLocalStorage();
          try {
            const result = await ActivateReservation({ Email: user.email });
            if (result.status === 200) {
              setIsCharging(true);
            } else if (result.data?.message === "Reservation not found") {
              setReservation(null);
            }
          } catch (error) {
            console.error("Error activating reservation:", error);
          }
    };


  
  useEffect(() => {
  
    if (
      chargingTrack.travelRoute.length > 0 &&
      selectedCar &&
      selectedCar.batteryPercentage > 0 &&
      !chargingTrack.isParked &&
      chargingTrack.currentPositionIndex !== chargingTrack.travelRoute.length -1
    ) {
      const interval = setInterval(() => {
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
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [chargingTrack.isParked, chargingTrack.currentPositionIndex,chargingTrack.travelRoute.length, selectedCar]);
  
  useEffect(() => {
    if (isCharging && reservation) {
      if (selectedCar?.batteryPercentage < 100) {
        const interval = setInterval(() => {
          const foundStation = stations.find(
            (station) => station.stationId === reservation.stationId
          );
          if (!foundStation) return; 
  
          setSelectedCar((prevCar) => {
            if (!prevCar) return prevCar;
  
            const updatedBattery = Math.min(100, prevCar.batteryPercentage + foundStation.chargerPower / 60);
  
            ChangeCarBattery({
              CarId: prevCar.carId,
              BatteryPercentage: updatedBattery,
            });
  
            return { ...prevCar, batteryPercentage: updatedBattery }; 
          });
        }, 1000);
  
        return () => clearInterval(interval);
      } else {
        setIsCharging(false);
      }
    }
  }, [isCharging, reservation, stations, selectedCar]);
  

  const isCloseEnough = (a, b, epsilon = 0.0002) => Math.abs(a - b) < epsilon;
  
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
                className={`car-item ${
                  selectedCar && selectedCar.carId === car.carId ? "active" : ""
                }`}
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
        {selectedCar && chargingTrack.travelRoute.length > 0 &&  !isCharging && (
          <div>
            <button
              onClick={() => {
                updateChargingTrackInLocalStorage("isParked", !chargingTrack.isParked);
                setChargingTrack((prevState) => ({
                  ...prevState,
                  isParked: !chargingTrack.isParked,
                }));
              }}
            >
              {chargingTrack.isParked ? "Resume Travel" : "Park Car"}
            </button>
          </div>
        )}
        {reservation ? (
  <div>
    <h4>Reservation</h4>
    <p>Start: {new Date(reservation.start).toLocaleString()}</p>
    <p>End: {new Date(reservation.end).toLocaleString()}</p>
    <button onClick={handleCancelReservation}>Cancel Reservation</button>
  </div>
) : (
  <p>No active reservations.</p>
)}

      </div>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[45.2671, 19.8335]}
          zoom={14}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stations.map((station) => {
            
            const getStationIcon = (availability) => {
              if(reservation?.stationId === station.stationId ){
                return userStationIcon;
              }
              const isReserved = reservations.some(
                (reservation) => reservation.stationId === station.stationId
              );
              if (isReserved) {
                return userStationIcon; 
              }
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
                    {reservation?.stationId !== station.stationId && station.chargerAvailability === "Available" && (
                      <button onClick={() => handleReserve(station)}>
                        Reserve
                      </button>
                    )}

                    {reservation?.stationId === station.stationId && 
                      (!isCloseEnough(chargingTrack.travelRoute[chargingTrack.currentPositionIndex][0], station.coordinates.lat) ||  
                       !isCloseEnough(chargingTrack.travelRoute[chargingTrack.currentPositionIndex][1], station.coordinates.lng)) && (
                          <button onClick={() => handleTravelTo(station)}>
                            Travel to
                          </button>
                    )}

                    {reservation?.stationId === station.stationId && 
                      isCloseEnough(chargingTrack.travelRoute[chargingTrack.currentPositionIndex][0], station.coordinates.lat) &&  
                      isCloseEnough(chargingTrack.travelRoute[chargingTrack.currentPositionIndex][1], station.coordinates.lng) && chargingTrack.isParked && !isCharging &&(
                          <button onClick={() => handleStartCharging(station)}>
                            Charge
                          </button>
                    )}


                  </div>
                </Popup>
              </Marker>
            );
          })}
          {locationOn &&
            chargingTrack.reservedStation !== -1 && (
              <Polyline
                positions={chargingTrack.travelRoute.slice(
                  chargingTrack.currentPositionIndex
                )}
                color="green"
              />
            )}
          {locationOn && (
            <Marker
              key={222}
              position={
                chargingTrack.travelRoute[chargingTrack.currentPositionIndex]
              }
              icon={carIcon}
              zIndexOffset={1000}
            ></Marker>
          )}
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


