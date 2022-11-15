import "./Simulador.css";
import "../../components/fonts.css";
import React, { useState, useRef } from "react";
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CardPercentage from "../../components/CardPercentage/CardPercentage";
import RedirectButton from "../../components/RedirectButton/RedirectButton";
import SmallCard from "../../components/SmallCard/SmallCard";
import UploadIcon from '@mui/icons-material/Upload';
import Map from "../../components/Map/MapSimulador";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormData from 'form-data';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import RedexLogo from "../../images/avionRedex.png";
import RedexVuelo from "../../images/airplane.png";
import RedexPlan from "../../images/list.png";
import RedexEnvio from "../../images/box.png";

import { sendFile } from "../../services/Envios";
import { simulatorInitial } from "../../services/Simulator";
import { simulatorPerBlock } from "../../services/Simulator";
import axios from "axios";

const Simulador = () => {
  const notifyError = (mensaje) => toast.error(mensaje);
  const enviosProceso = 0;
  const totalEnvios = 0;
  const [showTable, setShowTable] = useState(false);
  const [archEnvios, setArchEnvios] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [cadenaFechaInicio, setCadenaFechaInicio] = useState(() => {
    let [yyyy,mm,dd] = new Date(new Date(fechaInicio).getTime() - new Date(fechaInicio).getTimezoneOffset() * 60000).toISOString().split(/[/:\-T]/);
    return `${dd}/${mm}/${yyyy} 00:00`;
  });
  const [inicia, setInicia] = useState(0);
  const [procesado, setProcesado] = useState(false);
  const [vuelos, setVuelos] = useState([]);
  const [envios, setEnvios] = useState([]);
  const pdfExportComponent = useRef(null);

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

  /*const envios = [
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
    },
    {
      id: 90666,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 90890,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 906663,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    },
    {
      id: 908903,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05"
    }
  ];*/

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
    //setInicia(inicia+1);
    if (!comprobaciones()) return;
    var formData = new FormData();
    fechaInicio.setHours(0,0,0,0);
    formData.append("file", archEnvios);
    formData.append("fecha", fechaInicio);
    (async () => {
      const dataResult = await simulatorInitial(formData);
      console.log('1era simulacion cargada');
    })();
    setTimeout(() => {
      (async () => {
        const dataResult = await simulatorPerBlock(1);
        console.log('bloque 1');
        poblarEnvios(dataResult);
      })();
    }, 10000);
  }

  const poblarEnvios = (dataResult) => {
    let enviosArray = [];
    let dateFechaEnvio, dateFechaPartida, dateFechaDestino, yyyy, mm, dd, hh, mi;
    dataResult.envios.forEach((element) => {
      let planes = [], planIndex=0;
      if(element.planesDeVuelo == null){
        element.planesDeVuelo = [];
      }

      element.planesDeVuelo.forEach((elem) => {
        let escalas = [], vueloIndex=0;
        planIndex++;
        if(elem.vuelosPorPlanDeVuelo == null){
          elem.vuelosPorPlanDeVuelo = [];
        }

        elem.vuelosPorPlanDeVuelo.forEach((e) => {
          vueloIndex++;
          [yyyy,mm,dd,hh,mi] = new Date(e.vuelo.fechaPartida).toISOString().split(/[/:\-T]/);
          dateFechaPartida = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
          [yyyy,mm,dd,hh,mi] = new Date(e.vuelo.fechaDestino).toISOString().split(/[/:\-T]/);
          dateFechaDestino = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
          
          escalas.push({
            num: vueloIndex,
            aeroPartida: e.vuelo.aeropuertoPartida.codigo,
            aeroDestino: e.vuelo.aeropuertoDestino.codigo,
            fechaPartida: dateFechaPartida,
            fechaDestino: dateFechaDestino,
            duracion: `${String(Math.trunc(e.vuelo.duracion/60)).padStart(2,'0')}:${String(e.vuelo.duracion%60).padStart(2,'0')} hrs.`,
          });
        });

        planes.push({
          num: planIndex,
          paquetes: elem.numeroPaquetes,
          duracionTotal: `${String(Math.trunc(elem.duracionTotal/60)).padStart(2,'0')}:${String(elem.duracionTotal%60).padStart(2,'0')} hrs.`,
          vuelos: escalas
        });
      });

      [yyyy,mm,dd,hh,mi] = new Date(new Date(element.fechaEnvio).getTime() - new Date(element.fechaEnvio).getTimezoneOffset() * 60000).toISOString().split(/[/:\-T]/);
      dateFechaEnvio = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;

      enviosArray.push({
        codigo: element.codigo,
        fechaEnvio: dateFechaEnvio,
        paquetes: element.numeroPaquetes,
        aeroPartida: element.aeropuertoPartida.codigo,
        aeroDestino: element.aeropuertoDestino.codigo,
        planVuelo: planes
      });
    });
    setEnvios(enviosArray);
    setProcesado(!procesado);
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
                  let [yyyy,mm,dd] = new Date(new Date(nuevaFecha.$d).getTime() - new Date(nuevaFecha.$d).getTimezoneOffset() * 60000).toISOString().split(/[/:\-T]/);
                  setCadenaFechaInicio(`${dd}/${mm}/${yyyy} 00:00`);
                  setFechaInicio(nuevaFecha.$d);
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
        className="w-100" 
        onClick = {() => {
          iniciarSimulacion();
        }}
      >
        <RedirectButton text="Iniciar simulación" icon={<ArrowForwardIosIcon/>}/>
      </span>
      {procesado && <span 
        className="w-100" 
        onClick = {() => {
          if(pdfExportComponent.current){
            pdfExportComponent.current.save();
          }
        }}
      >
        <RedirectButton text="Exportar planes de vuelo" icon={<MoveToInboxIcon/>}/>
      </span>}
    </>
  );

  const enviosEstadisticas = (
    <>
    <div className="col-md-3 p15 h-100">
      <div className="grayBox shadowBox p15 h-100 opdia-relative">
        <div className="shadowBox">{enviosGraficos}</div>
        <div className="shadowBox simulador-SimulacionData">{simulacionData}</div>
        <div style={{ position: "absolute", left: "-10000000px", top: "-1000000px" /*top tmb xd, left: "-100000px", zIndex: "100000", top: 0,*/}}>
          <PDFExport ref={pdfExportComponent} paperSize="A4" fileName="envios.pdf">
            <div style={{ background: "#393E46", padding: "0.5cm", height: "100vh" }}>
              <div className="bloqueTitularPDF">
                <div className="bloqueTitularPDF2">
                  <img src={RedexLogo} height="50px" width="50px"/>
                  <div className="titularesPDF">
                    <p className="m-0">RedEx</p><p className="m-0">Paquetería</p>
                  </div>
                </div>
                <div className="parametrosInforme">
                  <p className="m-0">Inicio de Simulación</p><p style={{ marginBottom: "5px" }}>{cadenaFechaInicio}</p>
                  <p className="m-0">Última Actualización</p><p className="m-0">{cadenaFechaInicio}</p>
                </div>
              </div>
              <h1 className="tituloReporte">Relación de Envíos Planificados</h1>
              <h1 className="subtituloReporte">({envios.length} Envíos Planificados)</h1>
              <hr style={{ margin: "0", marginBottom: "10px", borderTop: "white 3px dotted" }}></hr>
              <div style={{ fontFamily: "montserrat", fontSize: "13px" }}>
                {envios.map((element) => (
                  <div>
                    <div className="bloqueTitularPDF2" style={{ marginBottom: "5px" }}>
                      <img src={RedexEnvio} height="20px" width="20px"/>
                      <p className="m-0" style={{ paddingLeft: "10px" }}>Envío '<span style={{ fontWeight: "bold" }}><u>{element.codigo}</u></span>'</p>
                    </div>
                    <p className="m-0"><span style={{ marginRight: "36px" }}>Fecha de Registro:</span> <span style={{ fontWeight: "bold" }}>{element.fechaEnvio}</span></p>
                    <p className="m-0"><span style={{ marginRight: "38px" }}>Total de Paquetes:</span> <span style={{ fontWeight: "bold" }}>{element.paquetes}</span></p>
                    <p className="m-0"><span style={{ marginRight: "8px" }}>Aeropuerto de Partida:</span> <span style={{ fontWeight: "bold" }}>{element.aeroPartida}</span></p>
                    <p className="m-0"><span style={{ marginRight: "5px" }}>Aeropuerto de Destino:</span> <span style={{ fontWeight: "bold" }}>{element.aeroDestino}</span></p>
                    <p className="m-0"><span style={{ marginRight: "42px" }}>#Planes de Vuelo:</span> <span style={{ fontWeight: "bold" }}>{element.planVuelo.length}</span></p>
                    <p style={{ fontWeight: "bold", margin: "3px 0px 5px 20px" }}><u>Planes de Vuelo:</u></p>
                    
                    {element.planVuelo.map((elem) => (
                      <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                        <div className="bloqueTitularPDF2" >
                          <img src={RedexPlan} height="20px" width="20px"/>
                          <p className="m-0" style={{ paddingLeft: "10px", fontWeight: "bold" }}><u>Plan de Vuelo #{elem.num}</u></p>
                        </div>
                        <div style={{ marginLeft: "30px" }}>
                          <p className="m-0"><span style={{ marginRight: "10px" }}> Paquetes trasladados: </span> <span style={{ fontWeight: "bold" }}>{elem.paquetes}</span></p>
                          <p className="m-0"><span style={{ marginRight: "54px" }}> Duración Total: </span> <span style={{ fontWeight: "bold" }}>{elem.duracionTotal}</span></p>
                          <p className="m-0"><span style={{ marginRight: "98px" }}> #Vuelos: </span> <span style={{ fontWeight: "bold" }}>{elem.vuelos.length}</span></p>

                          {elem.vuelos.map((e) => (
                            <div>
                              <div className="bloqueTitularPDF2" style={{ marginTop: "3px" }}>
                                <img src={RedexVuelo} height="20px" width="20px"/>
                                <p className="m-0" style={{ paddingLeft: "10px", fontWeight: "bold" }}><u>Vuelo #{e.num}</u></p>
                              </div>
                              <div style={{ marginLeft: "30px" }}>
                                <p className="m-0"><span style={{ marginRight: "21px" }}>Punto de Partida:</span> <span style={{ fontWeight: "bold" }}>{e.aeroPartida} {e.fechaPartida}</span></p>
                                <p className="m-0"><span style={{ marginRight: "18px" }}>Punto de Destino:</span> <span style={{ fontWeight: "bold" }}>{e.aeroDestino} {e.fechaDestino}</span></p>
                                <p className="m-0"><span style={{ marginRight: "9px" }}>Duración del Vuelo:</span> <span style={{ fontWeight: "bold" }}>{e.duracion}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <hr style={{ margin: "0", marginBottom: "10px", borderTop: "white 3px dotted" }}></hr>
                  </div>
                ))}
              </div>
            </div>
          </PDFExport>
        </div>
      </div>
    </div>
    </>
  );

  const mapaSimulador = (
    <>
    <div className="col-md-9 p15 h-100">
      <div className="grayBox shadowBox h-100 opdia-relative">
        <Map inicia={inicia} fechaInicio={fechaInicio}/>
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