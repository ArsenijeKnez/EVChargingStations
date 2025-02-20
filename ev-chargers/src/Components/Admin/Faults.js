import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { GetStationsWithFaultCount } from "../../Services/AdminService";
import FaultsList from "./FaultsList";
import {
  stationIcon,
  repairingStationIcon,
  reportWarningIcon,
} from "../Assets/MapIcons";

const Faults = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationsData = await GetStationsWithFaultCount();
        if (stationsData.status == 200) setStations(stationsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const showReport = (station) => {
    setSelectedStation(station);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      <div className="container mt-5 ">
        <MapContainer
          center={[45.2671, 19.8335]}
          zoom={14}
          style={{
            width: "70%",
            height: "600px",
            justifySelf: "center",
            borderRadius: 10,
            border: "2px solid #228B22",
          }}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stations.map((station) => {
            const faultCount = station.faultCount;
            const isFaulted = station.chargerAvailability === "Faulted";

            let icon;
            if (isFaulted) icon = repairingStationIcon;
            else if (faultCount > 0) {
              icon = reportWarningIcon;
            } else icon = stationIcon;
            return (
              <Marker
                key={station.stationId}
                position={[station.coordinates.lat, station.coordinates.lng]}
                icon={icon}
              >
                <Popup>
                  <h3>{station.name}</h3>
                  <p>Status: {station.chargerAvailability}</p>
                  <p>Fault Reports: {faultCount}</p>
                  {faultCount > 0 && (
                    <button onClick={() => showReport(station)}>
                      View Fault Reports
                    </button>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <div className="container mt-5 ">
        <div className="row justify-content-center">
          {selectedStation && (
            <FaultsList
              stationId={selectedStation.stationId}
              stationName={selectedStation.name}
              onClose={() => setSelectedStation(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Faults;
