import "./App.css";
import CardCollection from "./components/CardCollection";
import ChooseNumberPlayers from "./components/ChooseNumberPlayers";
import { useState } from "react";

function App() {
  const [numPlayers, setNumPlayers] = useState(-1);

  function chooseNumPlayers(n) {
    setNumPlayers(n);
  }

  return (
    <div className="App">
      <header className="App-header">
        {numPlayers === -1 ? (
          <ChooseNumberPlayers onClick={chooseNumPlayers} />
        ) : (
          <CardCollection numberOfCards={numPlayers === 2 ? 6 : 5} />
        )}
      </header>
    </div>
  );
}

export default App;
