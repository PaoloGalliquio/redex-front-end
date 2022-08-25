import "./OperacionesDiarias.css";
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import SmallCard from "../../components/SmallCard/SmallCard";
import RedirectButton from "../../components/RedirectButton/RedirectButton";

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
              <div className="row opdia-smallinfo">
                <div className="col">
                  <SmallCard
                    icon = {<ListIcon/>}
                    text = "Total de paquetes"
                    number = {128}
                  />
                </div>
              </div>
              <div className="row opdia-smallinfo">
                <div className="col">
                  <SmallCard
                    icon = {<ListIcon/>}
                    text = "Retrasos"
                    number = {1}
                    warningInPositive = {true}
                  />
                </div>
              </div>
              <div className="row opdia-smallinfo">
                <div className="col">
                  <SmallCard
                    icon = {<ListIcon/>}
                    text = "Aeropuertos inactivos"
                    number = {0}
                    warningInPositive = {true}
                  />
                </div>
              </div>
            </div>
          </div>
          <RedirectButton
            text = "Registrar pedido"
            icon = {<ArrowForwardIosIcon/>}
          />
          <RedirectButton
            text = "Registrar retraso(s)"
            icon = {<ArrowForwardIosIcon/>}
          />
        </div>
      </div>
      <div className="col-md-6 p15">
        <div className="shadowBox">
          
        </div>
      </div>
      <div className="col-md-3 p15">
        <div className="grayBox shadowBox p15">
          Viajes
        </div>
      </div>
    </div>
    </>
  );
}

export default OperacionesDiarias;