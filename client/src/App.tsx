import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import Station from "./components/station";

export interface IStation {
  lon: number;
  lat: number;
  station_id: string;
  // station_type: string;
  // region_id: number;
  // has_kiosk: boolean;
  // eightd_station_services: string[];
  // name: String;
  // rental_methods: string[];
  // rental_uris: {};
  // short_name: string;
  // electric_bike_surcharge_waiver: boolean;
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
    <div className="container mx-auto px-4">
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
        Lyft Stations
      </h1>

      <div className="flex flex-col">
        {stations === undefined ? (
          <p>Loading</p>
        ) : (
          <div>
            <label>
              Distance:
              <input
                value={distance}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDistance(parseFloat(e.target.value))
                }
                type="number"
              />
            </label>
            <h1>Stations: {stations.length}</h1>
            <div className="grid grid-cols-4 gap-4">
              {stations.map((station) => (
                <Station station={station} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
