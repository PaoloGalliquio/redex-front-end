import "./Simulador.css"
import React, { useState } from "react";
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
import Map from "../../components/Map/MapSimulador";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormData from 'form-data';

import { sendFile } from "../../services/Envios";
import axios from "axios";

const Simulador = () => {
  const notifyError = (mensaje) => toast.error(mensaje);
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

  const comprobaciones = () => {
    if (archEnvios == null){
      notifyError("Seleccione un archivo de envíos");
      return false;
    }
    if (fechaInicio == null){
      notifyError("Seleccione una fecha de inicio");
      return false;
    }
    return true;
  }

  const iniciarSimulacion = () => {
    if (!comprobaciones()) return;
    var formData = new FormData();
    formData.append("file", archEnvios);
    axios.post(process.env.REACT_APP_BACK_UL + "/envio/sendFile", formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data);
    })
  }

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
          <div className="col-md-6 my-auto">Archivo de envíos:</div>
          <div className="col-md-6">
            <label className="my-auto fileLabel" htmlFor="enviosFile">
              <UploadIcon /> Subir archivo
            </label>
            <input
              id="enviosFile"
              type="file"
              className="fileInput"
              accept=".txt"
              onChange={(e) => {
                setArchEnvios(e.target.files[0]);
              }}
            />
          </div>
          {archEnvios ? 
            <>
              <div className="col-md-6"></div>
              <div className="col-md-6 text-center">{archEnvios.name}</div>
            </>
            :
            <></>
          }
        </div>
      </div>
      <span 
        className="bottomButton w-100" 
        onClick = {() => {
          iniciarSimulacion();
        }}
      >
        <RedirectButton text="Iniciar simulación" icon={<ArrowForwardIosIcon/>}/>
      </span>
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

  const mapaSimulador = (
    <>
    <div className="col-md-9 p15 h-100">
      <div className="grayBox shadowBox h-100 opdia-relative">
        <Map />
      </div>
    </div>
    </>
  );

  return(
    <>
    <ToastContainer theme="dark" />
    <div className="row h-100">
      {enviosEstadisticas}
      {mapaSimulador}
      {!showTable && <>
      </>}
      {showTable && <>
      </>}
    </div>
    </>
  );
}

export default Simulador;