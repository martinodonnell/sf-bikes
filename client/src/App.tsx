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
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.78392060267635,
    lon: -122.43219948406649,
  });
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            console.log(result.state);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({ lat: coords.latitude, lon: coords.longitude });
      },
      (error) => {
        console.log("Error while getting coordinates. Keeping middle", error);
      }
    );
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
    <div>
      {filteredStations === undefined ? (
        <p>Loading</p>
      ) : (
        <div>
          <div className="p-4 absolute right-3 top-3 flex items-center justify-center z-20 bg-green-500 shadow-lg rounded-lg">
            <div className="flex flex-col">
              <div className="pb-2 flex flex-col">
                <label>Distance:</label>
                <input
                  value={distance}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDistance(parseFloat(e.target.value))
                  }
                  type="number"
                />
              </div>
              <div>
                <fieldset>
                  <legend>Do you want to limit by free bikes</legend>
                  <div className="flex">
                    <p className="pr-2">
                      <input
                        type="radio"
                        value={0}
                        id="no"
                        onChange={radioHandler}
                        checked={!freeElectric}
                      />
                      <label htmlFor="no" className="pl-2">
                        No
                      </label>
                    </p>

                    <p>
                      <input
                        type="radio"
                        value={1}
                        id="yes"
                        onChange={radioHandler}
                        checked={freeElectric}
                      />
                      <label htmlFor="yes" className="pl-2">
                        Yes
                      </label>
                    </p>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <Map
            currentLocation={currentLocation}
            stations={filteredStations}
            distance={distance}
          />
        </div>
      )}
    </div>
  );
}

export default App;
