import "./SmallCard.css"
import React from "react";

const SmallCard = (props) => {
  return(
    <>
    <div className={`row smallcard ${props.warningInPositive ? props.number > 0 ? "redBox" : "greenBox" :  "greenBox"}`}>
      <div className="col-md-9 p-0">
        <div className="smallcard-icon">
          {props.icon}
        </div>
        <div className="smallcard-number">
          {props.text}
        </div>
      </div>
      <div className="col-md-3 p-0 text-end">
        {props.number}
      </div>
    </div>
    </>
  );
}

export default SmallCard;