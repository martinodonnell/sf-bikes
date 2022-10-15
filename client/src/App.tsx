import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface IUser {
  users: [String] | undefined;
}

function App() {

  const [backendText, setBackendText] = useState<IUser>({users: undefined})

  useEffect(() => {
    fetch('/api').then(
      response => response.json()
    ).then(
      text => {
        console.log(text)
        setBackendText(text)
      }
    )
  },[])

  return (
    <div>
    {('users' in backendText && Object.keys(backendText).length > 0)  ? (
      <div>
        <p>{backendText['users']}</p>
      </div>
      ) : (
      <p>Loading</p>
    )}
    </div>
  )
}

export default App;
