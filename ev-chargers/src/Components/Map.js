import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "../Images/EVStation.png";
import getRoute from "../Services/RouteApi"

const customIcon = L.icon({
  iconUrl: icon, 
  iconSize: [30, 30], 
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30], 
});

const stations = [
  { id: 1, name: "Station 1", lat: 45.267390, lng: 19.832771},
  { id: 2, name: "Station 2", lat: 45.2771, lng: 19.8435 },
  { id: 3, name: "Station 3", lat: 45.244746, lng: 19.845665 },
  { id: 4, name: "Station 4", lat: 45.246128, lng: 19.851171 },
  { id: 5, name: "Station 5", lat: 45.244048, lng: 19.790787 },
  { id: 6, name: "Station Belgrade Waterfront", lat: 44.808155, lng: 20.449545 },
  { id: 7, name: "Station 7", lat: 45.233044, lng: 19.841142 },
  { id: 8, name: "Station 8", lat: 45.268625, lng: 19.856595 },
  { id: 9, name: "Station Petrovaradin", lat: 45.254386, lng: 19.859711 },
  { id: 10, name: "Station 10", lat: 45.2441, lng: 19.8130 },
  { id: 11, name: "Station Backa Palanka", lat: 45.249016, lng: 19.386733 },
  { id: 12, name: "Station 12", lat: 45.2574, lng: 19.8412 },
  { id: 13, name: "Station 13", lat: 45.2857, lng: 19.8446 },
  { id: 14, name: "Station Nokola Tesla", lat: 44.820483, lng: 20.289208 },
  { id: 15, name: "Station Backi Petrovac", lat: 45.352049, lng: 19.623704 },
  { id: 16, name: "Station 16", lat: 45.2543, lng: 19.8170 },
  { id: 17, name: "Station 17", lat: 45.2615, lng: 19.8205 },
  { id: 18, name: "Station 18", lat: 45.2749, lng: 19.8280 },
  { id: 19, name: "Station Kamenica", lat: 45.219681, lng: 19.855618 },
  { id: 20, name: "Station 20", lat: 45.2367, lng: 19.8065 },
  { id: 21, name: "Station 21", lat: 45.2715, lng: 19.8356 },
  { id: 22, name: "Station Futog", lat: 45.241713, lng: 19.711616 },
  { id: 23, name: "Station A1", lat: 45.625156, lng: 19.705900 },
  { id: 24, name: "Station Indjija", lat: 45.047790, lng: 20.092806 },
  { id: 25, name: "Station 25", lat: 45.251350, lng: 19.837524 },
  { id: 26, name: "Station 26", lat: 45.253175, lng: 19.846834 },
  { id: 27, name: "Station 27", lat: 45.257853, lng: 19.849350 },
  { id: 28, name: "Station Zrenjanin", lat: 45.382691, lng: 20.397011 },
  { id: 29, name: "Station Palic", lat: 46.098598, lng: 19.760805 },
  { id: 30, name: "Station Sombor", lat: 45.774877, lng: 19.114282 },
  { id: 31, name: "Station 31", lat: 45.258929, lng: 19.823732},
  { id: 32, name: "Station 32", lat: 45.248504, lng: 19.845246},
  { id: 33, name: "Station Belgrade", lat: 44.819994, lng: 20.466722},
  { id: 34, name: "Station 34", lat: 45.242231, lng: 19.834279},
];

const Map = () => {
  const [route, setRoute] = useState([]);

  /* useEffect(() => {
    const fetchRoute = async () => {
      const start = [stations[0].lng, stations[0].lat]; // [lng, lat]
      const end = [stations[1].lng, stations[1].lat];

      const routeCoordinates = await getRoute(start, end);
      setRoute(routeCoordinates);
    };

    fetchRoute();
  }, []); */

  return (
    <MapContainer center={[45.2671, 19.8335]} zoom={14} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map((station) => (
        <Marker key={station.id} position={[station.lat, station.lng]} icon={customIcon} >
          <Popup>{station.name}</Popup>
        </Marker>
      ))}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default Map;
