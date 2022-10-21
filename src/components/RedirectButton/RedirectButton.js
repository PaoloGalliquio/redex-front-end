import "./RedirectButton.css";
import React from "react";

const RedirectButton = (props) => {
  return (
    <>
      <a href={props.link}>
        <div className="purpleBox shadowBox redirectbutton-button pointer">
          {props.text}
          <div className="redirectbutton-icon">{props.icon}</div>
        </div>
      </a>
    </>
  );
};

export default RedirectButton;
