import "./CardPercentage.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CardPercentage = (props) => {
  return(
    <>
    <div className="greenBox cardPer-container">
      <div className="row">
        <div className="col text-center cardPer-title">
          <span className="me-2">
            {props.icon}
          </span>
          {props.title}
        </div>
      </div>
      <div className="row">
        <div className="col text-center cardPer-info">
          {props.info}
        </div>
      </div>
      <div className="row">
        <div className="col"></div>
        <div className="col cardPer-perc">
          {props.positive ? 
          <CircularProgressbar 
            value={props.percentage} 
            text={`${props.percentage}%`} 
            styles={buildStyles({
              textColor: "white",
              pathColor: "white",
              trailColor: "gray",
              textSize: "16px"
            })}
          />
          :
          <CircularProgressbar 
            value={props.percentage} 
            text={`${props.percentage}%`} 
            styles={buildStyles({
              textColor: "white",
              pathColor: "white",
              trailColor: "gray",
              textSize: "16px"
            })}
            counterClockwise
          />
          }
        </div>
      </div>
    </div>
    </>
  );
}

export default CardPercentage;