import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface IUser {
  users: [String] | undefined;
}

function App() {
  const [backendText, setBackendText] = useState<IUser>({ users: undefined });

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((text) => {
        console.log(text);
        setBackendText(text);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <div className="flex flex-col">
        {"users" in backendText && Object.keys(backendText).length > 0 ? (
          <p>{backendText["users"]}</p>
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  );
}

export default App;
