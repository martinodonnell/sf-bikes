import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IStation } from "../App";

interface IMap {
  currentLocation: { lat: number; lon: number };
  stations: IStation[];
}
function Map({ currentLocation, stations }: IMap) {
  return (
    <div className="h-96">
      <h1>map</h1>
      <MapContainer
        center={[currentLocation.lat, currentLocation.lon]}
        zoom={15}
        style={{ height: "100vh", width: "100wh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[currentLocation.lat, currentLocation.lon]}>
          <Popup>Current Location</Popup>
        </Marker>

        {stations.map((station) => (
          <Marker position={[station.lat, station.lon]}>
            <Popup>{station.station_id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
