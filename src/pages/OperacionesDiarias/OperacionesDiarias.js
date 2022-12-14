import "./OperacionesDiarias.css";
import React, { useEffect, useState } from "react";
import FlightIcon from "@mui/icons-material/Flight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListIcon from "@mui/icons-material/List";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from '@mui/icons-material/Close';
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import SmallCard from "../../components/SmallCard/SmallCard";
import RedirectButton from "../../components/RedirectButton/RedirectButton";
import Button from "../../components/Button/Button";
import Map from "../../components/Map/Map";
import CardShipping from "../../components/CardShipping/CardShipping";
import { getEnvios } from "../../services/Envios";
import Modal from "../../components/Modal/Modal.js";
import {useModal} from "../../components/Modal/useModal";

const OperacionesDiarias = () => {
  const enviosProceso = 38;
  const totalEnvios = 128;
  const [envios, setEnvios] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [isOpenModal1, openModal1, closeModal1] = useModal(true);

  const headerTable = [
    {
      id: 0,
      name: "Código",
    },
    {
      id: 1,
      name: "Carga",
    },
    {
      id: 2,
      name: "Origen",
    },
    {
      id: 3,
      name: "Destino",
    },
    {
      id: 4,
      name: "Hora de salida",
    },
    {
      id: 5,
      name: "Hora de llegada",
    },
    {
      id: 6,
      name: "Tiempo recorrido",
    },
  ];

  const enviosData = [
    {
      id: 90584,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90585,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90586,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90587,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90588,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
  ];

  const enviosEstadisticas = (
    <>
      <div className="col-md-3 p15 h-100">
        <div className="grayBox shadowBox p15 h-100 opdia-relative">
          <div className="shadowBox">
            <div className="purpleBox opdia-envio-title">Envíos</div>
            <div className="blackBox opdia-envio-container p10">
              <div className="row">
                <div className="col opdia-envio-card1">
                  <CardPercentage
                    icon={<FlightIcon className="rotate45" />}
                    title="En proceso"
                    info={`${enviosProceso} envíos en proceso`}
                    percentage={(enviosProceso / totalEnvios) * 100}
                    positive={true}
                  />
                </div>
                <div className="col opdia-envio-card2">
                  <CardPercentage
                    icon={<CheckCircleIcon />}
                    title="Atendidos"
                    info={`${totalEnvios - enviosProceso} envíos atendidos`}
                    percentage={
                      ((totalEnvios - enviosProceso) / totalEnvios) * 100
                    }
                    positive={false}
                  />
                </div>
              </div>
              <div className="row opdia-smallinfo">
                <div className="col ps-0 pe-0">
                  <SmallCard
                    icon={<ListIcon />}
                    text="Total de paquetes"
                    number={totalEnvios}
                  />
                </div>
              </div>
            </div>
          </div>
          {!showTable && (
            <>
              <span
                className="bottomButton w-100"
                onClick={() => {
                  setShowTable(false);
                }}>
                <RedirectButton
                  text="Registrar envío"
                  link="/NuevoEnvio"
                  icon={<ArrowForwardIosIcon />}
                />
              </span>
            </>
          )}
          {showTable && (
            <>
              <span
                className="bottomButton w-100"
                onClick={() => {
                  setShowTable(false);
                }}>
                <RedirectButton
                  text="Mapa de envíos"
                  icon={<ArrowBackIosNewIcon />}
                />
              </span>
            </>
          )}
        </div>
        <Modal isOpen={isOpenModal1} closeModal={closeModal1} icon = {<CloseIcon />}>
          <div className = "container">
            <div className = "col opdia-titulo-modal">
              <h2>Simulación interrumpida.</h2>
            </div>
            <div className = "col opdia-subtitulo-modal">
              <h4>Se ha producido un colapso logístico</h4>
            </div>
            <div className = "col opdia-mensaje-modal">
              <ul>
                <li>Tiempo total de simulación:</li>
                <li>Envíos en proceso:</li>
                <li>Envíos atendidos: </li>
                <li>Envíos totales: </li>
              </ul>
            </div>
          </div> 
          <div className = "container">
            <div className = "row">
              <div className = "col-sm">
                <Button
                  text="Imprimir Reporte"
                  link="/OperacionesDiarias"
                  color="purpleBox"
                />
              </div>
              <div className = "col-sm">
                <Button
                  text="Aceptar"
                  link="/OperacionesDiarias"
                  color="greenBox"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );

  const mapa = (
    <>
      <div className="col-md-7 p15 h-100">
        <div className="shadowBox h-100">
          <Map />
        </div>
      </div>
    </>
  );

  const enviosDetalle = (
    <>
      <div className="col-md-2 p15 h-100">
        <div className="grayBox shadowBox opdia-envios-detalle h-100">
          <div className="opdia-height-overflow">
            {enviosData.map((envio) => {
              return <CardShipping envio={envio} />;
            })}
          </div>
          <span
            className="opdia-ver-todos w-100"
            onClick={() => {
              setShowTable(true);
            }}>
            <RedirectButton text="Ver todos" icon={<ArrowForwardIosIcon />} />
          </span>
        </div>
      </div>
    </>
  );

  const tablaEnvios = (
    <>
      <div className="col-md-9 p15">
        <div className="opdia-table-container shadowBox">
          <table className="w-100">
            <thead>
              <tr className="purpleBox">
                {headerTable.map((header) => {
                  return (
                    <th key={header.id} className="text-center">
                      {header.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {enviosData.map((envio) => {
                return (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.carga} paquetes</td>
                    <td>{envio.origen}</td>
                    <td>{envio.detino}</td>
                    <td className="text-center">{envio.horaSalida}</td>
                    <td className="text-center">{envio.horaLlegada}</td>
                    <td className="text-center">{envio.tiempoRecorrido}</td>
                  </tr>
                );
              })}
              {enviosData.map((envio) => {
                return (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.carga} paquetes</td>
                    <td>{envio.origen}</td>
                    <td>{envio.detino}</td>
                    <td className="text-center">{envio.horaSalida}</td>
                    <td className="text-center">{envio.horaLlegada}</td>
                    <td className="text-center">{envio.tiempoRecorrido}</td>
                  </tr>
                );
              })}
              {enviosData.map((envio) => {
                return (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.carga} paquetes</td>
                    <td>{envio.origen}</td>
                    <td>{envio.detino}</td>
                    <td className="text-center">{envio.horaSalida}</td>
                    <td className="text-center">{envio.horaLlegada}</td>
                    <td className="text-center">{envio.tiempoRecorrido}</td>
                  </tr>
                );
              })}
              {enviosData.map((envio) => {
                return (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.carga} paquetes</td>
                    <td>{envio.origen}</td>
                    <td>{envio.detino}</td>
                    <td className="text-center">{envio.horaSalida}</td>
                    <td className="text-center">{envio.horaLlegada}</td>
                    <td className="text-center">{envio.tiempoRecorrido}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    (async () => {
      setEnvios(await getEnvios());
    })();
  }, []);

  return (
    <>
      <div className="row h-100">
        {enviosEstadisticas}
        {!showTable && (
          <>
            {mapa}
            {enviosDetalle}
          </>
        )}
        {showTable && <>{tablaEnvios}</>}
      </div>
    </>
  );
};

export default OperacionesDiarias;
