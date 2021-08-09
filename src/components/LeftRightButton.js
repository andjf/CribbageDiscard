import React from "react";
import "./LeftRightButton.css";

function LeftRightButton({ next, previous }) {
  return (
    <div className="navButtonContainer">
      <button onClick={previous} className="leftButton navButton">
        <strong className="arrowText">{"<"}</strong>
      </button>
      <button onClick={next} className="rightButton navButton">
        <strong className="arrowText">{">"}</strong>
      </button>
    </div>
  );
}

export default LeftRightButton;
