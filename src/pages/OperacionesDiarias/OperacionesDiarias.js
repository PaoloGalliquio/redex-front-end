import "./OperacionesDiarias.css";
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OperacionesDiarias = () => {
  return(
    <>
    <div className="row">
      <div className="col-md-3 p15">
        <div className="grayBox shadowBox p15">
          <div className="shadowBox">
            <div className="purpleBox opdia-pedidos-title">
              Pedidos
            </div>
            <div className="blackBox opdia-pedidos-container p10">
              <div className="row">
                <div className="col opdia-pedidos-card1">
                  <CardPercentage
                    icon = {<FlightIcon/>}
                    title = "En proceso"
                    info = "38 pedidos en proceso"
                    percentage = {29.68}
                    positive = {true}
                  />
                </div>
                <div className="col opdia-pedidos-card2">
                  <CardPercentage
                    icon = {<CheckCircleIcon/>}
                    title = "Atendidos"
                    info = "90 pedidos atendidos"
                    percentage = {70.31}
                    positive = {false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 p15">
        <div className="grayBox shadowBox">
          Mapa
        </div>
      </div>
      <div className="col-md-3 p15">
        <div className="grayBox shadowBox">
          Viajes
        </div>
      </div>
    </div>
    </>
  );
}

export default OperacionesDiarias;