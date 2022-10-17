import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import Station from "./components/station";
import Map from "./components/map";

export interface IStation {
  lon: number;
  lat: number;
  station_id: string;
  status: IStationStatus | undefined;
}

export interface IStationStatus {
  is_installed: number;
  is_renting: number;
  is_returning: number;
  num_bikes_available: number;
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  num_ebikes_available: number;
  num_scooters_available: number;
  num_scooters_unavailable: number;
  station_id: string;
  station_status: string;
}

function App() {
  const oneKmToGeocoding = 110.574;
  const currentLocation = { lat: 37.78392060267635, lon: -122.43219948406649 };

  const [distance, setDistance] = useState<number>(1);
  const [stations, setStations] = useState<IStation[] | undefined>();
  const [freeElectric, setFreeElectric] = useState<boolean>(false);

  useEffect(() => {
    const tempStations = fetch(
      "https://gbfs.baywheels.com/gbfs/fr/station_information.json"
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data.stations;
      });
    const tempStatus = fetch(
      "https://gbfs.baywheels.com/gbfs/en/station_status.json"
    )
      .then((response) => response.json())
      .then((data) => {
        return data.data.stations;
      });

    Promise.all([tempStations, tempStatus]).then((data) => {
      setStations(
        data[0].map((station: IStation) => {
          station.status = data[1].filter(
            (status: IStationStatus) => status.station_id === station.station_id
          )[0];
          return station;
        })
      );
    });
  }, []);

  const distanceCalculator = () => distance / oneKmToGeocoding;

  const withinXKMFilter = ({ lat, lon }: IStation) => {
    if (Number.isNaN(distance)) {
      return false;
    }
    return (
      currentLocation.lon - distanceCalculator() <= lon &&
      lon <= currentLocation.lon + distanceCalculator() &&
      currentLocation.lat - distanceCalculator() <= lat &&
      lat <= currentLocation.lat + distanceCalculator()
    );
  };

  const freeElectricFilter = (station: IStation) => {
    if (station.status === undefined || !freeElectric) {
      return true;
    }

    return (
      station.status.num_bikes_available === 0 &&
      station.status.num_ebikes_available > 0
    );
  };

  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeElectric(event.target.value === "1" ? true : false);
  };

  const filteredStations = !Number.isNaN(distance)
    ? stations?.filter(withinXKMFilter).filter(freeElectricFilter)
    : [];

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600">
        Lyft Stations
      </h1>

      <div className="flex flex-col">
        {filteredStations === undefined ? (
          <p>Loading</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Map
                currentLocation={currentLocation}
                stations={filteredStations}
                distance={distance}
              />
            </div>
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

              <fieldset>
                <legend>Do you want to limit by free bikes</legend>
                <p>
                  <input
                    type="radio"
                    value={0}
                    id="no"
                    onChange={radioHandler}
                    checked={!freeElectric}
                  />
                  <label htmlFor="no">No</label>
                </p>

                <p>
                  <input
                    type="radio"
                    value={1}
                    id="yes"
                    onChange={radioHandler}
                    checked={freeElectric}
                  />
                  <label htmlFor="yes">Yes</label>
                </p>
              </fieldset>
              <h1>Stations: {filteredStations.length}</h1>
              <div className="grid grid-cols-4 gap-4">
                {filteredStations.map((station, index) => (
                  <Station station={station} key={index} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
