import React from "react";
import "./ChooseNumberPlayers.css";

function ChooseNumberPlayers({ onClick }) {
  return (
    <div className="chooseContainer">
      <h1>How many players?</h1>
      <div className="numButtonContainer">
        <button className="numButton" onClick={() => onClick(2)}>
          2
        </button>
        <button className="numButton" onClick={() => onClick(3)}>
          3
        </button>
      </div>
    </div>
  );
}

export default ChooseNumberPlayers;
