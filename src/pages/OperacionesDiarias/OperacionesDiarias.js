import "./OperacionesDiarias.css";
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import SmallCard from "../../components/SmallCard/SmallCard";
import RedirectButton from "../../components/RedirectButton/RedirectButton";
import Map from "../../components/Map/Map";

const OperacionesDiarias = () => {
  const enviosProceso = 38;
  const totalEnvios = 128;

  return(
    <>
    <div className="row h-100">
      <div className="col-md-3 p15 h-100">
        <div className="grayBox shadowBox p15 h-100">
          <div className="shadowBox">
            <div className="purpleBox opdia-pedidos-title">Envíos</div>
            <div className="blackBox opdia-pedidos-container p10">
              <div className="row">
                <div className="col opdia-pedidos-card1">
                  <CardPercentage
                    icon = {<FlightIcon/>}
                    title = "En proceso"
                    info = {`${enviosProceso} envíos en proceso`}
                    percentage = {enviosProceso/totalEnvios*100}
                    positive = {true}
                  />
                </div>
                <div className="col opdia-pedidos-card2">
                  <CardPercentage
                    icon = {<CheckCircleIcon/>}
                    title = "Atendidos"
                    info = {`${totalEnvios-enviosProceso} envíos atendidos`}
                    percentage = {(totalEnvios-enviosProceso)/totalEnvios*100}
                    positive = {false}
                  />
                </div>
              </div>
              <div className="row opdia-smallinfo">
                <div className="col">
                  <SmallCard
                    icon = {<ListIcon/>}
                    text = "Total de paquetes"
                    number = {totalEnvios}
                  />
                </div>
              </div>
            </div>
          </div>
          <RedirectButton
            text = "Registrar pedido"
            icon = {<ArrowForwardIosIcon/>}
          />
        </div>
      </div>
      <div className="col-md-6 p15 h-100">
        <div className="shadowBox h-100">
          <Map/>
        </div>
      </div>
      <div className="col-md-3 p15 h-100">
        <div className="grayBox shadowBox p15">
          Viajes
        </div>
      </div>
    </div>
    </>
  );
}

export default OperacionesDiarias;