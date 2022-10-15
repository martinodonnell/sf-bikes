import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface IStation {
  lon: number;
  legacy_id: number;
  station_id: string;
  lat: number;
  capacity: number;
  station_type: string;
  region_id: number;
  has_kiosk: boolean;
  eightd_station_services: string[];
  name: String;
  rental_methods: string[];
  rental_uris: {};
  short_name: string;
  electric_bike_surcharge_waiver: boolean;
}

function App() {
  const oneKmToGeocoding = 110.574;
  const currentLocation = { lat: 37.78392060267635, lon: -122.43219948406649 };

  const [distance, setDistance] = useState<number>(1);
  const [stations, setStations] = useState<IStation[] | undefined>();

  useEffect(() => {
    fetch("https://gbfs.baywheels.com/gbfs/fr/station_information.json")
      .then((response) => response.json())
      .then((data) => {
        setStations(data.data.stations.filter(withinXKM));
      });
  }, [distance]);

  const distanceCalculator = () => distance / oneKmToGeocoding;

  const withinXKM = ({ lat, lon }: IStation) => {
    return (
      currentLocation.lon - distanceCalculator() <= lon &&
      lon <= currentLocation.lon + distanceCalculator() &&
      currentLocation.lat - distanceCalculator() <= lat &&
      lat <= currentLocation.lat + distanceCalculator()
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <div className="flex flex-col">
        {stations === undefined ? (
          <p>Loading</p>
        ) : (
          <div>
            <input
              value={distance}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDistance(parseFloat(e.target.value))
              }
              type="number"
            />

            <h1>Stations: {stations.length}</h1>
            {stations.map((station, key) => (
              <div
                key={key}
                className="max-w-sm rounded overflow-hidden shadow-lg my-5"
              >
                <p>lat: {station.lat}</p>
                <p>lon: {station.lon}</p>
                {/* <p>capacity {station.capacity}</p>
                <p>capacity {station.capacity}</p> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
