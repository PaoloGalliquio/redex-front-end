import "./Button.css";
import React from "react";

const Button = (props) => {
  return (
    <>
      <a href={props.link}>
        <div className= {`shadowBox button ${props.color}`}>
          {props.text}
        </div>
      </a>
    </>
  );
};

export default Button;