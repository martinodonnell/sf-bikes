import React from "react";
import { IStation } from "../App";

function Station({ station }: { station: IStation }) {
  const { status } = station;
  const statusClassName = () => {
    if (status !== null && status !== undefined) {
      if (status.station_status === "active") {
        return "bg-green-200";
      } else {
        return "bg-red-200";
      }
    } else {
      return "bg-green-200";
    }
  };

  return (
    <div
      key={station.station_id}
      className={`max-w-sm rounded overflow-hidden shadow-lg p-5 my-2 ${statusClassName()}`}
    >
      <p>lat: {station.lat}</p>
      <p>lon: {station.lon}</p>
      <div>
        <p>E Bikes {status?.num_ebikes_available}</p>
        <p>real Bikes {status?.num_bikes_available}</p>
        <p>Free Bike? {status?.num_bikes_available === 0 ? "Yes" : "no"}</p>
      </div>
    </div>
  );
}

export default Station;
