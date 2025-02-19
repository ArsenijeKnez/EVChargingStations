import L from "leaflet";
import icon from "../../Images/EVStation.png";
import reserve from "../../Images/EVStationReserved.png";
import repair from "../../Images/EVStationRepair.png";
import car from "../../Images/Car.png";
import user from "../../Images/EVStationUser.png";
import "leaflet/dist/leaflet.css";

export const carIcon = L.icon({
  iconUrl: car,
  iconSize: [32, 15],
  iconAnchor: [6, 12],
});

export const stationIcon = L.icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export const reservedStationIcon = L.icon({
  iconUrl: reserve,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export const repairingStationIcon = L.icon({
  iconUrl: repair,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export const userStationIcon = L.icon({
  iconUrl: user,
  iconSize: [40, 40],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
