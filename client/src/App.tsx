import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface IUser {
  users: string[] | undefined;
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
        {backendText.users !== undefined ? (
          backendText["users"].map((user, key) => <div key={key}>{user}</div>)
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  );
}

export default App;
