import "./Simulador.css"
import { useState } from "react";
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import RedirectButton from "../../components/RedirectButton/RedirectButton";
import SmallCard from "../../components/SmallCard/SmallCard";
import UploadIcon from '@mui/icons-material/Upload';

const Simulador = () => {
  const enviosProceso = 0;
  const totalEnvios = 0;
  const [showTable, setShowTable] = useState(false);
  const [archEnvios, setArchEnvios] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const styles = {
    field: {
      "& .MuiInputBase-root": {
        color: "white",
      },
      "& .MuiFormLabel-root": {
        color: "gray",
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: "white",
      },
      "& .MuiInput-underline:after": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiInput-underline:before": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiFormLabel-root.Mui-focused:hover": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
    },
    select: {
      "&": {
        color: "gray",
      },
      "&.Mui-focused": {
        color: "white",
      },
      "& .MuiSelect-select": {
        color: "white",
      },
      "&:after": {
        borderBottom: "3px solid #5351B7",
      },
      "&:before": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
    },
  };

  const headerTable = [
    {
      id: 0,
      name: "Código"
    },
    {
      id: 1,
      name: "Carga"
    },
    {
      id: 2,
      name: "Origen"
    },
    {
      id: 3,
      name: "Destino"
    },
    {
      id: 4,
      name: "Hora de salida"
    },
    {
      id: 5,
      name: "Hora de llegada"
    },
    {
      id: 6,
      name: "Tiempo recorrido"
    }
  ];

  const envios = [
    {
      id: 90584,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 90585,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 90586,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 90587,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 90588,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    }
  ];

  const enviosGraficos = (
    <>
    <div className="purpleBox opdia-envio-title">Envíos</div>
    <div className="blackBox opdia-envio-container p10">
      <div className="row">
        <div className="col opdia-envio-card1">
          <CardPercentage
            icon = {<FlightIcon className="rotate45"/>}
            title = "En proceso"
            info = {`${enviosProceso} envíos en proceso`}
            percentage = {enviosProceso/totalEnvios*100}
            positive = {true}
          />
        </div>
        <div className="col opdia-envio-card2">
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
        <div className="col ps-0 pe-0">
          <SmallCard
            icon = {<ListIcon/>}
            text = "Total de paquetes"
            number = {totalEnvios}
          />
        </div>
      </div>
    </div>
    </>
  );

  const simulacionData = (
    <>
      <div className="purpleBox opdia-envio-title">Simulación</div>
      <div className="blackBox opdia-envio-container p10">
        <div className="row mb-3 mt-3">
          <div className="col my-auto">Fecha de inicio:</div>
          <div className="col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Fecha de inicio"
                inputFormat="DD/MM/YYYY"
                value={fechaInicio}
                onChange={(nuevaFecha) => {
                  setFechaInicio(nuevaFecha);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" sx={styles.field} />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col my-auto">Archivo de envíos:</div>
          <div className="col">
            <label className="my-auto fileLabel" for="enviosFile">
              <UploadIcon /> Subir archivo
            </label>
            <input
              id="enviosFile"
              type="file"
              className="fileInput"
              onChange={(e) => {
                setArchEnvios(e.target.files[0]);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  const enviosEstadisticas = (
    <>
    <div className="col-md-3 p15 h-100">
      <div className="grayBox shadowBox p15 h-100 opdia-relative">
        <div className="shadowBox">{enviosGraficos}</div>
        <div className="shadowBox simulador-SimulacionData">{simulacionData}</div>
      </div>
    </div>
    </>
  );

  return(
    <>
    <div className="row h-100">
      {enviosEstadisticas}
      {!showTable && <>
      </>}
      {showTable && <>
      </>}
    </div>
    </>
  );
}

export default Simulador;