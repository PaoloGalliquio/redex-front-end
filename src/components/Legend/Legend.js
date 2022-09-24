import "./Legend.css";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Legend = () => {
  return(
    <div className="legend-absolute shadowBox">
      <div className="legend-container">
        <div className="purpleBox legend-title">Leyenda</div>
        <div className="blackBox legend-container p10">
          <div><AirplanemodeActiveIcon className="rotate45"/> Avión</div>
          <div><PlayArrowIcon style={{transform: "rotate(-90deg)"}}/> Aeropuerto</div>
          <div><HorizontalRuleIcon className="legend-line"/> Ruta de avión</div>
          <div className="mb-1">Capacidad</div>
          <div className="legend-capacity-container">
            <div className="square-green">
              <div className="legend-capacity">0</div>
            </div>
            <div className="square-yellow">
              <div className="legend-capacity">25</div>
            </div>
            <div className="square-orange">
              <div className="legend-capacity">50</div>
            </div>
            <div className="square-red">
              <div className="legend-capacity">75</div>
              <div className="legend-capacity-end">100</div>
            </div>
          </div>
          <div>&#8203;</div>
        </div>
      </div>
    </div>
  );
}

export default Legend;