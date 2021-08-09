import React from "react";
import "./Popup.css";

function Popup({ trigger, setTrigger, children }) {
  return trigger ? (
    <div className="popup">
      <div className="popupInner">
        <button className="closeButton" onClick={() => setTrigger(false)}>
          X
        </button>
        {children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
