import React from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IStation } from "../App";

interface IMap {
  currentLocation: { lat: number; lon: number };
  stations: IStation[];
  distance: number;
}
function Map({ currentLocation, stations, distance }: IMap) {
  return (
    <div className="absolute top-0 bottom-0 w-full z-10">
      <MapContainer
        center={[currentLocation.lat, currentLocation.lon]}
        zoom={15}
        style={{ height: "100%", width: "100% " }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={[currentLocation.lat, currentLocation.lon]}
          pathOptions={{ fillColor: "blue", fillOpacity: 0.5 }}
          radius={50}
          stroke={false}
        />

        {distance && (
          <Circle
            center={[currentLocation.lat, currentLocation.lon]}
            pathOptions={{ fillColor: "blue", fillOpacity: 0.1 }}
            radius={distance * 1100}
            stroke={false}
          />
        )}

        {stations.map((station, key) => (
          <Circle
            key={key}
            center={[station.lat, station.lon]}
            pathOptions={{ fillColor: "red", fillOpacity: 0.5 }}
            radius={50}
            stroke={false}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
