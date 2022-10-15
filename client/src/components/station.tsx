import React, { ChangeEvent, useEffect, useState } from "react";

interface IStation {
  lon: number;
  lat: number;
  capacity: number;
  station_id: string;
}
interface IStationStatus {
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

function Station({ station }: { station: IStation }) {
  const [stationStatus, setStationStatus] = useState<
    undefined | null | IStationStatus
  >();

  useEffect(() => {
    fetch("https://gbfs.baywheels.com/gbfs/en/station_status.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredStations = data.data.stations.filter(filterStations);
        if (filteredStations !== undefined && filteredStations.length === 1) {
          setStationStatus(filteredStations[0]);
        } else {
          setStationStatus(null);
        }
      });
  }, []);

  const statusClassName = () => {
    if (stationStatus !== null && stationStatus !== undefined) {
      if (stationStatus.station_status === "active") {
        return "bg-green-200";
      } else {
        return "bg-red-200";
      }
    } else {
      return "bg-green-200";
    }
  };

  const filterStations = (stat: IStation) => {
    return stat.station_id === station.station_id;
  };

  return (
    <div
      key={station.station_id}
      className={`max-w-sm rounded overflow-hidden shadow-lg p-5 my-2 ${statusClassName()}`}
    >
      <p>Capacity: {station.capacity}</p>
      <p>lat: {station.lat}</p>
      <p>lon: {station.lon}</p>
      {stationStatus === undefined ? (
        <p>Loading status</p>
      ) : stationStatus === null ? (
        <p>Not found</p>
      ) : (
        <div>
          <p>E Bikes {stationStatus.num_ebikes_available}</p>
          <p>Bikes {stationStatus.num_bikes_available}</p>
        </div>
      )}
    </div>
  );
}

export default Station;
