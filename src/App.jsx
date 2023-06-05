import { useEffect, useState } from 'react';
import Block from "./Block";
import Account from "./Account";
import './App.scss';


function App() {
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Block
        address={address}
        setAddress={setAddress}
      />
      <Account
        address={address}
        setAddress={setAddress}
      />
    </div>
  );
}

export default App;
