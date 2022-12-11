import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // Load worker code separately with worker-loader
import "mapbox-gl/dist/mapbox-gl.css";
import "./Simulador.css";
import "../../components/fonts.css";
import React, { useState, useRef, useEffect } from "react";
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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "../../components/Button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormData from 'form-data';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import RedexLogo from "../../images/avionRedex.png";
import RedexVuelo from "../../images/airplane.png";
import RedexPlan from "../../images/list.png";
import RedexEnvio from "../../images/box.png";
import Checkbox from '@mui/material/Checkbox';
import SockJS from "sockjs-client";
import { over } from "stompjs";

import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";
import Legend from "../../components/Legend/Legend";
import * as turf from "@turf/turf";
import airportImage from "../../images/newAirport.png";
import airplaneImage from "../../images/avion2.png";

import { getAeropuertos } from "../../services/Aeropuertos";

mapboxgl.workerClass = MapboxWorker;
let copiaFin=false;
let copiaFechaSimu = new Date();

var stompClient = null;
let enviosFin=[];
let vuelos = [];
let envios = [];
let inicioAux=0;
let indexVuelo = -1;
let indexEnvio = -1;
let enviosEnProcesoFin = 0;
let enviosAtendidosFin = 0;
let envioUltimo = {
  codigo: '',
  fechaEnvio: '',
  paquetes: -1,
  aeroPartida: '',
  aeroDestino: ''
};


const Simulador = () => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [longitud, setlongitud] = useState(-10.490544872911897);
  const [lat, setLat] = useState(21.104512028667855);
  const [zoom, setZoom] = useState(1.8);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [htmlAeropuertos, setHtmlAeropuertos] = useState([]);
  const [planificador, setPlanificador] = useState(1);
  const [fechaZero, setFechaZero] = useState(new Date());
  const [cadaHora, setCadaHora] = useState(-1);
  const [cadaVuelo, setCadaVuelo] = useState(-1);
  const [cadaEnvio, setCadaEnvio] = useState(-1);
  const [cada10Min, setCada10Min] = useState(-1);
  const [aeropuertosCargados, setAeropuertosCargados] = useState(0);
  const [aeroEventosCargados, setAeroEventosCargados] = useState(0);

  const notifyError = (mensaje) => toast.error(mensaje);
  const [showTable, setShowTable] = useState(false);
  const [archEnvios, setArchEnvios] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [diasSimu, setDiasSimu] = useState(5);
  const [fechaSimu, setFechaSimu] = useState(new Date());
  const [clock, setClock] = useState();
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState();
  const [cadenaFechaInicio, setCadenaFechaInicio] = useState(() => {
    let [yyyy,mm,dd] = new Date(new Date(fechaInicio).getTime() - new Date(fechaInicio).getTimezoneOffset() * 60000).toISOString().split(/[/:\-T]/);
    return `${dd}/${mm}/${yyyy} 00:00`;
  });
  const [fechaFin, setFechaFin] = useState(new Date(new Date().setHours(new Date().getHours()+(diasSimu*24))));
  const [inicia, setInicia] = useState(-1);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [enviosReporte, setEnviosReporte] = useState([]);
  const [vuelosReporte, setVuelosReporte] = useState([]);
  const [enviosTabla, setEnviosTabla] = useState([]);
  const [vuelosTabla, setVuelosTabla] = useState([]);
  const [enviosEnProceso, setEnviosEnProceso] = useState(0);
  const [enviosAtendidos, setEnviosAtendidos] = useState(0);
  const [totalPaquetes, setTotalPaquetes] = useState(0);
  const [finSimulacion, setFinSimulacion] = useState(false);
  const [iniciaSimu, setIniciaSimu] = useState(0);
  const [cadaEnvioFin, setCadaEnvioFin] = useState(-1);
  const [checked, setChecked] = React.useState(false);
  const pdfExportComponentEnvio = useRef(null);
  const pdfExportComponentVuelo = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [verificar, setVerificar] = useState({cod: -1, paq: 0});

  let ocupadoAero = [];

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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: '#393E46',
    pt: 2,
    px: 4,
    pb: 3,
  };

  const headerTableVuelo = [
    {
      id: 0,
      name: "Código",
    },
    {
      id: 1,
      name: "Partida",
    },
    {
      id: 2,
      name: "Destino",
    },
    {
      id: 3,
      name: "Duración",
    },
    {
      id: 4,
      name: "Ocupación Efectiva",
    },
    {
      id: 5,
      name: "#Envíos",
    }
  ];

  const headerTableEnvio = [
    {
      id: 0,
      name: "Código",
    },
    {
      id: 1,
      name: "Fecha de Registro",
    },
    {
      id: 2,
      name: "#Paquetes",
    },
    {
      id: 3,
      name: "Aeropuerto de Partida",
    },
    {
      id: 4,
      name: "Aeropuerto de Destino",
    }
  ];

  function ordenarEnvios( a, b ) {
    if ( a.fechaEnvioUTC < b.fechaEnvioUTC ){
      return -1;
    }
    if ( a.fechaEnvioUTC > b.fechaEnvioUTC ){
      return 1;
    }
    return 0;
  }

  function ordenarVuelos( a, b ) {
    if ( a.fechaPartidaUTC < b.fechaPartidaUTC ){
      return -1;
    }
    if ( a.fechaPartidaUTC > b.fechaPartidaUTC ){
      return 1;
    }
    return 0;
  }

  const handleChangeCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  function almacenarEnAeropuerto (cod, cant) {
    const event = new CustomEvent('updateCant', {
      detail:{
        cantidad: cant
      }
    });
    htmlAeropuertos[cod].dispatchEvent(event);
  }

  function retirarDeAeropuerto (cod, cant) {
    const event = new CustomEvent('envioEnd', {
      detail:{
        cantidad: cant
      }
    });
    htmlAeropuertos[cod].dispatchEvent(event);
  }

  function verRutasAviones () {
    for(let i=0; i<=indexVuelo; i++){
      if(map.current.getLayer("route"+i)){
        map.current.setPaintProperty('route'+i, 'line-width', checked ? 1 : 0);
      }
    }
  }

  const despacharVuelos = (index, route, point) => {
    if(vuelos[index].ocupado>0){
      almacenarEnAeropuerto(vuelos[index].idDestino, vuelos[index].ocupado);
    }
    eliminarVuelos(index, route, point);
  }
  
  const eliminarVuelos = (index, route, point) => {
    //elimina componentes visuales para liberar memoria
    route.features[0].geometry.coordinates = [];
    point.features[0].geometry.coordinates = [];
    
    if(map.current.getLayer("route"+index)){
      map.current.removeLayer("route"+index);
    }
    if(map.current.getLayer("point"+index)){
      map.current.removeLayer("point"+index);
    }
    if(map.current.getSource("route"+index)){
      map.current.removeSource("route"+index);
    }
    if(map.current.getSource("point"+index)){
      map.current.removeSource("point"+index);
    }
  }

  const animarVuelos = async (index, route, point, counter, steps, time) => {
    let start, end;
    while(!copiaFin){
      if(vuelos[index].fechaDestinoUTC<=(copiaFechaSimu.getTime()+18000000)){
        despacharVuelos(index, route, point);
        break;
      }
      start =
      route.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];
      end =
        route.features[0].geometry.coordinates[
          counter >= steps ? counter : counter + 1
        ];
      if (!start || !end) {
        despacharVuelos(index, route, point);
        break;
      }

      point.features[0].geometry.coordinates =
        route.features[0].geometry.coordinates[counter];

      point.features[0].properties.bearing = turf.bearing(
        turf.point(start),
        turf.point(end)
      );

      map.current.getSource("point"+index).setData(point);
      map.current.getSource("route"+index).setData(route);

      counter = counter + 1;
      if (counter >= steps) {
        despacharVuelos(index, route, point);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, time));
    }
    if(copiaFin){
      eliminarVuelos(index, route, point);
    }
  };

  const trazarRutas = (index, route, point, steps) => {
    const lineDistance = turf.length(route.features[0]);
    let arc = [];

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }

    route.features[0].geometry.coordinates = arc;
    let counter = 0;
    let time = vuelos[index].duracion;
    retirarDeAeropuerto(vuelos[index].idPartida, vuelos[index].ocupado);

    animarVuelos(index, route, point, counter, steps, time);
  };

  const vuelosEnMapa = async (index) => {
    let descColor = vuelos[index].capacidad*0.75<vuelos[index].ocupado ? "#fa0202" :
    vuelos[index].capacidad*0.50<vuelos[index].ocupado ? "#f79205" :
    vuelos[index].capacidad*0.25<vuelos[index].ocupado ? "#f6fa02" : "#25c71a";
    //declarar la línea para recorrer
    let route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [
                aeropuertos[vuelos[index].idPartida].longitud,
                aeropuertos[vuelos[index].idPartida].latitud,
              ],
              [
                aeropuertos[vuelos[index].idDestino].longitud,
                aeropuertos[vuelos[index].idDestino].latitud,
              ],
            ]
          }
        }
      ]
    };

    //el punto que estará en animación, comienza en 'origin'
    let point = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            description: `De <b style="font-weight:800;">${aeropuertos[vuelos[index].idPartida].codigo}</b> ${vuelos[index].fechaPartidaTexto}<br>A <b style="font-weight:800;">${aeropuertos[vuelos[index].idDestino].codigo}</b> ${vuelos[index].fechaDestinoTexto}<br><hr style="margin: 0; border-top: black 3px solid;">Duración total: <b style="font-weight:800;">${vuelos[index].duracionTexto}</b><br>Capacidad del vuelo: <b style="font-weight:800;">${vuelos[index].capacidad}</b> paquetes<br>Uso efectivo: ${vuelos[index].ocupado}/${vuelos[index].capacidad} <b style="font-weight:900; background: ${descColor};">(${Math.round((vuelos[index].ocupado*100/vuelos[index].capacidad)*10)/10}% usado)</b>`
          },
          geometry: {
            type: "Point",
            coordinates: [
              aeropuertos[vuelos[index].idPartida].longitud,
              aeropuertos[vuelos[index].idPartida].latitud,
            ]
          }
        }
      ]
    };

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.current.addSource("route"+index, {
      type: "geojson",
      data: route
    });

    map.current.addSource("point"+index, {
      type: "geojson",
      data: point,
      tolerance: 0
    });
    
    map.current.addLayer({
      id: "route"+index,
      source: "route"+index,
      type: "line",
      paint: {
        "line-width": checked ? 1 : 0,
        "line-color": "#203f4f"
      }
    });

    map.current.addLayer({
      id: "point"+index,
      source: "point"+index,
      type: "symbol",
      layout: {
        "icon-image": 'myAirplane',
        "icon-size": 0.19,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-color": vuelos[index].capacidad*0.75<vuelos[index].ocupado ? "#f56770" :
        vuelos[index].capacidad*0.50<vuelos[index].ocupado ? "#fcca56" :
        vuelos[index].capacidad*0.25<vuelos[index].ocupado ? "#eff53d" : "#86e39a",
        "icon-halo-color": "black",
        "icon-halo-width": 0.4
        //capacidad: [0-25]=>verde, ]25,50]=>amarillo, ]50,75]=>naranja, ]75,100]=>rojo
        //#86e39a: verde, #eff53d: amarillo, #fcca56:naranja, #f56770:rojo
      }
    });

    map.current.on('mouseenter', 'point'+index, (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
    });

    map.current.on('mouseleave', 'point'+index, () => {
      popup.remove();
    });

    trazarRutas(index, route, point, 20);
  }

  const setearAeropuertosEnMapa = () => {
    let arrayHtml = [];
    aeropuertos.forEach((element) => {
      ocupadoAero.push(0);
      let descColor = element.capacidad*0.75<ocupadoAero[element.id-1] ? "#fa0202" :
      element.capacidad*0.50<ocupadoAero[element.id-1] ? "#f79205" :
      element.capacidad*0.25<ocupadoAero[element.id-1] ? "#f6fa02" : "#25c71a";
      let UTC = "UTC";
      UTC += element.utc>=0 ? " + " : " - ";
      UTC += String(Math.abs(element.utc)).padStart(2,'0')+":00";
      let description = `Aeropuerto <b style="font-weight:800;">${element.codigo}</b> (<b style="font-weight:800;">${UTC}</b>)<br><hr style="margin: 0; border-top: black 3px solid;">Capacidad: <b style="font-weight:800;">${element.capacidad}</b> paquetes<br>Uso efectivo: ${ocupadoAero[element.id-1]}/${element.capacidad} <b style="font-weight:800; background: ${descColor};">(${Math.round((ocupadoAero[element.id-1]*100/element.capacidad)*10)/10}% en uso)</b>`;
      arrayHtml.push(document.createElement("div"));
      arrayHtml[element.id-1].className = "marker";
      arrayHtml[element.id-1].style.backgroundImage = `url(${airportImage})`;
      arrayHtml[element.id-1].style.filter = element.capacidad*0.75<ocupadoAero[element.id-1] ? "invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)" :
      element.capacidad*0.50<ocupadoAero[element.id-1] ? "invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)" :
      element.capacidad*0.25<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)";
      arrayHtml[element.id-1].style.width = `13px`;
      arrayHtml[element.id-1].style.height = `13px`;
      arrayHtml[element.id-1].style.backgroundSize = "100%";

      //al posar el cursor sobre el ícono de aeropuerto..
      arrayHtml[element.id-1].addEventListener("mouseenter", () => {
        popup
          .setLngLat([element.longitud, element.latitud])
          .setHTML(description)
          .addTo(map.current);
      });

      //al retirar el cursor sobre el ícono de aeropuerto...
      arrayHtml[element.id-1].addEventListener("mouseleave", () => {
        popup.remove();
      });

      //evento personalizado: al llegar un avion, actualiza la cantidad de paquetes en el almacen en el aeropuerto arribado
      arrayHtml[element.id-1].addEventListener("updateCant", (e) => {
        ocupadoAero[element.id-1] += e.detail.cantidad;
        if(ocupadoAero[element.id-1]>(6*element.capacidad)){
          console.log('termino');
          setFinSimulacion(true);
        }
        descColor = element.capacidad*6<ocupadoAero[element.id-1] ? "#fa0202" :
        element.capacidad*4<ocupadoAero[element.id-1] ? "#f79205" :
        element.capacidad*2<ocupadoAero[element.id-1] ? "#f6fa02" : "#25c71a";
        description = `Aeropuerto <b style="font-weight:800;">${element.codigo}</b> (<b style="font-weight:800;">${UTC}</b>)<br><hr style="margin: 0; border-top: black 3px solid;">Capacidad: <b style="font-weight:800;">${element.capacidad}</b> paquetes<br>Uso efectivo: <b style="font-weight:800; background: ${descColor};">(${Math.round((ocupadoAero[element.id-1]*100/(5*element.capacidad))*10)/10}% en uso)</b>`;
        arrayHtml[element.id-1].style.filter = element.capacidad*6<ocupadoAero[element.id-1] ? "invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)" :
        element.capacidad*4<ocupadoAero[element.id-1] ? "invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)" :
        element.capacidad*2<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)";
      });

      //retirar envio
      arrayHtml[element.id-1].addEventListener("envioEnd", (e) => {
        ocupadoAero[element.id-1] -= e.detail.cantidad;
        descColor = element.capacidad*6<ocupadoAero[element.id-1] ? "#fa0202" :
        element.capacidad*4<ocupadoAero[element.id-1] ? "#f79205" :
        element.capacidad*2<ocupadoAero[element.id-1] ? "#f6fa02" : "#25c71a";
        description = `Aeropuerto <b style="font-weight:800;">${element.codigo}</b> (<b style="font-weight:800;">${UTC}</b>)<br><hr style="margin: 0; border-top: black 3px solid;">Capacidad: <b style="font-weight:800;">${element.capacidad}</b> paquetes<br>Uso efectivo: <b style="font-weight:800; background: ${descColor};">(${Math.round((ocupadoAero[element.id-1]*100/(5*element.capacidad))*10)/10}% en uso)</b>`;
        arrayHtml[element.id-1].style.filter = element.capacidad*6<ocupadoAero[element.id-1] ? "invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)" :
        element.capacidad*4<ocupadoAero[element.id-1] ? "invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)" :
        element.capacidad*2<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)";
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      // Add markers to the map.
      new mapboxgl.Marker(arrayHtml[element.id-1])
        .setLngLat([element.longitud, element.latitud])
        .addTo(map.current);
    });
    setHtmlAeropuertos(arrayHtml);
  };

  const comprobaciones = () => {
    // if (archEnvios == null){
    //   notifyError("Seleccione un archivo de envíos");
    //   return false;
    // }
    if (fechaInicio == null){
      notifyError("Seleccione una fecha de inicio");
      return false;
    }
    return true;
  }

  const connect = async () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe("/simulator", onSimulation);
    stompClient.subscribe("/simulator/response", onSimulationResponse);
    sendDate();
  };

  const sendDate = () => {
    var date = {
      fecha: fechaInicio
    };
    stompClient.send("/app/simulator", {}, JSON.stringify(date));
  };

  const onSimulation = (payload) => {
    console.log(payload.body);
  }

  const onSimulationResponse = (payload) => {
    //para ver solo uno en especifico
    //console.log(JSON.parse(payload.body).envios);

    if(JSON.parse(payload.body).ultimoEnvio == null){
      console.log(JSON.parse(payload.body));
      poblarEnvios(JSON.parse(payload.body).envios);
      poblarVuelos(JSON.parse(payload.body).vuelos);
    }else{
      let auxFinal = JSON.parse(payload.body).ultimoEnvio;
      let [yyyy,mm,dd,hh,mi] = new Date(new Date(auxFinal.fechaEnvio).getTime()).toISOString().split(/[/:\-T]/);
      envioUltimo.codigo = auxFinal.codigo;
      envioUltimo.fechaEnvio = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
      envioUltimo.paquetes = auxFinal.numeroPaquetes;
      envioUltimo.aeroPartida = auxFinal.aeropuertoPartida.codigo;
      envioUltimo.aeroDestino = auxFinal.aeropuertoDestino.codigo;
      setFinSimulacion(true);
    }

    if(inicioAux==0){
      inicioAux++;
      setInicia(inicia+1);
    }
  }

  const onError = (err) => {
    console.log(err);
  };

  const iniciarSimulacion = async () => {
    if (!comprobaciones()) return;
    fechaInicio.setHours(0,0,0,0);
    console.log(fechaInicio);
    await connect();
  }

  const poblarEnvios = (enviosRpta) => {
    let enviosArray = [];
    let dateFechaEnvio, dateFechaPartida, dateFechaDestino, dateFechaDestinoUTC, dateFechaEnvioUTC, dateFinalizadoUTC, yyyy, mm, dd, hh, mi;
    let paq=0;

    enviosRpta.forEach((element) => {
      let planes = [], planIndex=0;
      if(element.planesDeVuelo != null && element.planesDeVuelo.length>0){
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
            dateFechaDestinoUTC = new Date(new Date(e.vuelo.fechaDestinoUTC0).getTime() + new Date(e.vuelo.fechaDestinoUTC0).getTimezoneOffset() * 60000);
            
            escalas.push({
              num: vueloIndex,
              codigo: e.vuelo.codigo,
              aeroPartida: e.vuelo.aeropuertoPartida.codigo,
              aeroDestino: e.vuelo.aeropuertoDestino.codigo,
              fechaPartida: dateFechaPartida,
              fechaDestino: dateFechaDestino,
              fechaDestinoUTC: dateFechaDestinoUTC,
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
  
        [yyyy,mm,dd,hh,mi] = new Date(new Date(element.fechaEnvio).getTime()).toISOString().split(/[/:\-T]/);
        dateFechaEnvio = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        dateFechaEnvioUTC = new Date(new Date(element.fechaEnvioUTC).getTime() + new Date(element.fechaEnvioUTC).getTimezoneOffset() * 60000);
        dateFinalizadoUTC = new Date(new Date(element.fechaFinalizadoUTC).getTime() + new Date(element.fechaFinalizadoUTC).getTimezoneOffset() * 60000);
  
        enviosArray.push({
          codigo: element.codigo,
          fechaEnvio: dateFechaEnvio,
          fechaEnvioUTC: dateFechaEnvioUTC.getTime(),
          fechaFinUTC: dateFinalizadoUTC,
          paquetes: element.numeroPaquetes,
          aeroPartida: element.aeropuertoPartida.codigo,
          aeroDestino: element.aeropuertoDestino.codigo,
          idPartida: element.aeropuertoPartida.id-1,
          idDestino: element.aeropuertoDestino.id-1,
          planVuelo: planes,
          estado: 0
        });
        paq+=element.numeroPaquetes;
      }
    });

    enviosArray.sort(ordenarEnvios);
    llenarFechaFin(enviosArray);
    let enviosConVuelos = [];
    let prob;
    enviosArray.map((envio) => {
      if(envio.planVuelo[0].vuelos.length > 1)
        enviosConVuelos.push(envio);
      else{
        prob = Math.floor(Math.random() * 100);
        if(prob === 0) enviosConVuelos.push(envio);
      }
    })
    if(enviosConVuelos.length>80){
      setEnviosReporte(enviosConVuelos.slice(0,80));
    }else{
      setEnviosReporte(enviosConVuelos.concat(enviosReporte).slice(0,80));
    }
    if(enviosArray.length>60){
      setEnviosTabla(enviosArray.slice(0,60));
    }else{
      setEnviosTabla(enviosArray);
    }
    enviosEnProcesoFin+=enviosArray.length;
    setTotalPaquetes(totalPaquetes+paq);

    envios = envios.concat(enviosArray);
  }

  const llenarFechaFin = (enviosArray) => {
    enviosArray.forEach((e) => {
      enviosFin.push({
        fechaFin: e.fechaFinUTC.getTime(),
        idDestino: e.idDestino,
        paquetes: e.paquetes
      });
    });
  }

  const poblarVuelos = (vuelosRpta) => {
    let datePartida, datePartidaUTC, dateDestino, dateDestinoUTC, datePartidaTexto, dateDestinoTexto;
    let yyyy,mm,dd,hh,mi;
    let vuelosArray=[];
    
    vuelosRpta.forEach((element) => {
        datePartida = new Date(new Date(element.fechaPartida).getTime() + new Date(element.fechaPartida).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaPartida).toISOString().split(/[/:\-T]/);
        datePartidaTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        datePartidaUTC = new Date(new Date(element.fechaPartidaUTC0).getTime() + new Date(element.fechaPartidaUTC0).getTimezoneOffset() * 60000);
        dateDestino = new Date(new Date(element.fechaDestino).getTime() + new Date(element.fechaDestino).getTimezoneOffset() * 60000);
        dateDestinoUTC = new Date(new Date(element.fechaDestinoUTC0).getTime() + new Date(element.fechaDestinoUTC0).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaDestino).toISOString().split(/[/:\-T]/);
        dateDestinoTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        
        vuelosArray.push({
          codigo: element.codigo,
          fechaPartidaTexto: datePartidaTexto,
          fechaPartidaUTC: datePartidaUTC.getTime() - 18000000,
          fechaDestinoTexto: dateDestinoTexto,
          fechaDestinoUTC: dateDestinoUTC.getTime() - 18000000,
          duracion: Math.round((element.duracion*2500/10)/20), //20   o    Math.round((element.duracion*1.6/10)*10)/10,
          duracionTexto: `${String(Math.trunc(element.duracion/60)).padStart(2,'0')}:${String(element.duracion%60).padStart(2,'0')} hrs.`,
          capacidad: element.capacidad,
          ocupado: element.capacidad-element.capacidadActual, //100   o   element.capacidad - element.capacidadActual,
          idPartida: element.aeropuertoPartida.id-1,
          idDestino: element.aeropuertoDestino.id-1,
          envios: element.envios,
          estado: 0 //0: no atendido, 1: en vuelo, 2: termina
        });
      
    });

    vuelosArray.sort(ordenarVuelos);

    if(vuelosArray.length>80){
      setVuelosReporte(vuelosArray.slice(0,80));
    }else{
      setVuelosReporte(vuelosArray);
    }
    if(vuelosArray.length>60){
      setVuelosTabla(vuelosArray.slice(0,60));
    }else{
      setVuelosTabla(vuelosArray);
    }
    
    vuelos = vuelos.concat(vuelosArray);
    console.log(vuelos);
    //setVuelos(arr => [...arr, ...vuelosArray]);
  }

  /*const enviosGraficos = (
    <>
   <div className="purpleBox opdia-envio-title">Envíos</div>
    <div className="blackBox opdia-envio-container p10" style={{ height: "30vh", overflow: "auto" }}>
      <div className="row">
        <div className="col opdia-envio-card1">
          <CardPercentage
            icon = {<FlightIcon className="rotate45"/>}
            title = "En proceso"
            info = {`${enviosEnProcesoFin} envíos en proceso`}
            percentage = {enviosEnProcesoFin/envios.length*100}
            positive = {true}
          />
        </div>
        <div className="col opdia-envio-card2">
          <CardPercentage
            icon = {<CheckCircleIcon/>}
            title = "Atendidos"
            info = {`${enviosAtendidosFin} envíos atendidos`}
            percentage = {enviosAtendidosFin/envios.length*100}
            positive = {true}
          />
        </div>
      </div>
      <div className="row opdia-smallinfo">
        <div className="col ps-0 pe-0">
          <SmallCard
            icon = {<ListIcon/>}
            text = "Total de paquetes"
            number = {totalPaquetes}
          />
        </div>
      </div>
    </div>
    </>
  );*/

  const simulacionData = (
    <>
      <div className="purpleBox opdia-envio-title">Simulación</div>
      <div className="blackBox opdia-envio-container p10" style={{ height: "100%", overflow: "auto" }}>
        <div className="row mb-3 mt-3">
          <div className="col my-auto">Fecha de inicio:</div>
          <div className="col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="DD/MM/YYYY"
                value={fechaInicio}
                readOnly={inicia>0}
                onChange={(nuevaFecha) => {
                  let [yyyy,mm,dd] = new Date(new Date(nuevaFecha.$d).getTime() - new Date(nuevaFecha.$d).getTimezoneOffset() * 60000).toISOString().split(/[/:\-T]/);
                  setCadenaFechaInicio(`${dd}/${mm}/${yyyy} 00:00`);
                  setFechaInicio(nuevaFecha.$d);
                  setFechaFin(new Date(new Date(nuevaFecha.$d).setHours(new Date(nuevaFecha.$d).getHours()+(diasSimu*24))));
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" sx={styles.field} />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="row mb-3 mt-3">
          <div className="col my-auto">Ver rutas de vuelos</div>
          <div className="col-4">
            <Checkbox
              checked={checked}
              onChange={handleChangeCheckbox}
              inputProps={{ 'aria-label': 'controlled' }}
              style={{ background: "#bce8ea" }}
              disabled={inicia<=0}
            />
          </div>
        </div>
        <div className="row mb-3">
          {archEnvios ? 
            <>
              <div className="col-md-6"></div>
              <div className="col-md-6 text-center">{archEnvios.name}</div>
            </>
            :
            <></>
          }

          {(inicia==0) && <span 
            className="w-100" 
            onClick = {() => {
              iniciarSimulacion();
            }}
          >
            <RedirectButton text="Iniciar simulación" icon={<ArrowForwardIosIcon/>}/>
          </span>}
          <span
            className="w-100"
            onClick={() => {
              setShowTable(true);
            }}>
            <RedirectButton
              text="Relación Vuelos y Envíos"
              icon={<ArrowBackIosNewIcon />}
            />
          </span>
          <span 
            className="w-100" 
            onClick = {() => {
              if(pdfExportComponentEnvio.current){
                pdfExportComponentEnvio.current.save();
              }
            }}
          >
            <RedirectButton text="Exportar detalle de envíos" icon={<MoveToInboxIcon/>}/>
          </span>
          <span 
            className="w-100" 
            onClick = {() => {
              if(pdfExportComponentVuelo.current){
                pdfExportComponentVuelo.current.save();
              }
            }}
          >
            <RedirectButton text="Exportar detalle de vuelos" icon={<MoveToInboxIcon/>}/>
          </span>
        </div>
      </div>
    </>
  );

  const tablas = (
    <>
      <div className="p10">
        <div className="purpleBox opdia-envio-title" style={{ padding: "0px" }}>Vuelos</div>
        <div className="opdia-table-container shadowBox" style={{ marginBottom: "15px" }}>
          <table className="w-100">
            <thead>
              <tr className="purpleBox">
                {headerTableVuelo.map((header) => {
                  return (
                    <th key={header.id} className="text-center">
                      {header.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody style={{ maxHeight: "200px"}}>
              {vuelosTabla.map((vuelo) => {
                return (
                  <div>
                  <tr>
                    <td className="text-center">{vuelo.codigo}</td>
                    <td className="text-center">[{aeropuertos[vuelo.idPartida].codigo}]: {vuelo.fechaPartidaTexto}</td>
                    <td className="text-center">[{aeropuertos[vuelo.idDestino].codigo}]: {vuelo.fechaDestinoTexto}</td>
                    <td className="text-center">{vuelo.duracionTexto}</td>
                    <td className="text-center">{vuelo.ocupado}/{vuelo.capacidad} ({Math.round((vuelo.ocupado*100/vuelo.capacidad)*10)/10}% usado)</td>
                    <td className="text-center">{vuelo.envios.length}</td>
                  </tr>
                  <tr>
                    {vuelo.envios.map((elem) => (
                      <p style={{ marginBottom: "0px", marginLeft: "10px"}}>Envío {elem.codigo}: {elem.numeroPaquetes} paquete(s)</p>
                    ))}
                  </tr>
                  <hr style={{ margin: "0", marginBottom: "0px", marginTop: "5px", borderTop: "white 3px dotted" }}></hr>
                </div>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="purpleBox opdia-envio-title" style={{ padding: "0px" }}>Envíos</div>
        <div className="opdia-table-container shadowBox">
          <table className="w-100">
            <thead>
              <tr className="purpleBox">
                {headerTableEnvio.map((header) => {
                  return (
                    <th key={header.id} className="text-center">
                      {header.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody style={{ maxHeight: "200px"}}>
              {enviosTabla.map((envio) => {
                return (
                  <div>
                  <tr>
                    <td className="text-center">{envio.codigo}</td>
                    <td className="text-center">{envio.fechaEnvio}</td>
                    <td className="text-center">{envio.paquetes}</td>
                    <td className="text-center">{envio.aeroPartida}</td>
                    <td className="text-center">{envio.aeroDestino}</td>
                  </tr>
                  <tr>
                    {envio.planVuelo.map((elem) => (
                      <div>
                        <p style={{ marginBottom: "0px", marginLeft: "10px"}}><u>Plan de Vuelo #{elem.num}</u></p>
                        {elem.vuelos.map((e) => (
                          <div>
                          <p style={{ marginBottom: "0px", marginLeft: "10px"}}>Vuelo {e.codigo} {"-->"} DE [{e.aeroPartida}]: {e.fechaPartida} A [{e.aeroDestino}]: {e.fechaDestino}</p>
                          <p style={{ marginBottom: "0px", marginLeft: "10px"}}>Duracion del Vuelo: ({e.duracion})</p> 
                          </div>
                        ))}
                      </div>
                    ))}
                  </tr>
                  <hr style={{ margin: "0", marginBottom: "0px", marginTop: "5px", borderTop: "white 3px dotted" }}></hr>
                </div>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const cerrarModal = () => {
    setOpenModal(false);
  };

  const enviosEstadisticas = (
    <>
    <div className="col-md-5 p15 h-100">
      <div className="grayBox shadowBox p15 h-100 opdia-relative">
      {!showTable && <div className="shadowBox simulador-SimulacionData">{simulacionData}</div>}
      {showTable && <>{tablas}</>}
      {showTable && (
        <>
          <span
            className="w-100"
            onClick={() => {
              setShowTable(false);
            }}>
            <RedirectButton
              text="Resumen de Operaciones"
              icon={<ArrowForwardIosIcon />}
            />
          </span>
        </>
      )}

        <div style={{ position: "absolute", left: "-10000000px", top: "-1000000px" /*top tmb xd, left: "-100000px", zIndex: "100000", top: 0,*/}}>
          <PDFExport ref={pdfExportComponentEnvio} paperSize="A4" fileName="envios.pdf">
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
                  <p className="m-0">Última Actualización</p><p className="m-0">{clock}</p>
                </div>
              </div>
              <h1 className="tituloReporte">Relación de Envíos Planificados</h1>
              <h1 className="subtituloReporte">({envios.length} Envíos Planificados)</h1>
              {envioUltimo.paquetes>0 && (
                <>
                  <hr style={{ margin: "0", marginBottom: "10px", borderTop: "white 3px dotted" }}></hr>
                  <h1 className="subtituloReporte">Colapso logístico al intentar procesar envío</h1>
                  <div style={{ fontFamily: "montserrat", fontSize: "13px" }}>
                    <div className="bloqueTitularPDF2" style={{ marginBottom: "5px" }}>
                      <img src={RedexEnvio} height="20px" width="20px"/>
                      <p className="m-0" style={{ paddingLeft: "10px" }}>Envío '<span style={{ fontWeight: "bold" }}><u>{envioUltimo.codigo}</u></span>'</p>
                    </div>
                    <p className="m-0"><span style={{ marginRight: "36px" }}>Fecha de Registro:</span> <span style={{ fontWeight: "bold" }}>{envioUltimo.fechaEnvio}</span></p>
                    <p className="m-0"><span style={{ marginRight: "38px" }}>Total de Paquetes:</span> <span style={{ fontWeight: "bold" }}>{envioUltimo.paquetes}</span></p>
                    <p className="m-0"><span style={{ marginRight: "8px" }}>Aeropuerto de Partida:</span> <span style={{ fontWeight: "bold" }}>{envioUltimo.aeroPartida}</span></p>
                    <p className="m-0"><span style={{ marginRight: "5px" }}>Aeropuerto de Destino:</span> <span style={{ fontWeight: "bold" }}>{envioUltimo.aeroDestino}</span></p>
                  </div>
                </>
              )}
              
              <hr style={{ margin: "0", marginBottom: "10px", borderTop: "white 3px dotted" }}></hr>
              <div style={{ fontFamily: "montserrat", fontSize: "13px" }}>
                {enviosReporte.map((element) => (
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
                                <p className="m-0" style={{ paddingLeft: "10px", fontWeight: "bold" }}>Vuelo <u>'{e.codigo}'</u></p>
                              </div>
                              <div style={{ marginLeft: "30px" }}>
                                <p className="m-0"><span style={{ marginRight: "21px" }}>Punto de Partida:</span> <span style={{ fontWeight: "bold" }}>[{e.aeroPartida}]: {e.fechaPartida}</span></p>
                                <p className="m-0"><span style={{ marginRight: "18px" }}>Punto de Destino:</span> <span style={{ fontWeight: "bold" }}>[{e.aeroDestino}]: {e.fechaDestino}</span></p>
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
        <div style={{ position: "absolute", left: "-10000000px", top: "-1000000px"}}>
          <PDFExport ref={pdfExportComponentVuelo} paperSize="A4" fileName="vuelos.pdf">
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
                  <p className="m-0">Última Actualización</p><p className="m-0">{clock}</p>
                </div>
              </div>
              <h1 className="tituloReporte">Relación de Vuelos Programados</h1>
              <h1 className="subtituloReporte">({vuelos.length} Vuelos Programados)</h1>
              <hr style={{ margin: "0", marginBottom: "10px", borderTop: "white 3px dotted" }}></hr>
              <div style={{ fontFamily: "montserrat", fontSize: "13px" }}>
                {vuelosReporte.map((element) => (
                  <div>
                    <div className="bloqueTitularPDF2" style={{ marginBottom: "5px" }}>
                      <img src={RedexVuelo} height="20px" width="20px"/>
                      <p className="m-0" style={{ paddingLeft: "10px" }}>Vuelo '<span style={{ fontWeight: "bold" }}><u>{element.codigo}</u></span>'</p>
                    </div>
                    <p className="m-0"><span style={{ marginRight: "40px" }}>Punto de Partida:</span> <span style={{ fontWeight: "bold" }}>[{aeropuertos[element.idPartida].codigo}]: {element.fechaPartidaTexto}</span></p>
                    <p className="m-0"><span style={{ marginRight: "38px" }}>Punto de Destino:</span> <span style={{ fontWeight: "bold" }}>[{aeropuertos[element.idDestino].codigo}]: {element.fechaDestinoTexto} </span></p>
                    <p className="m-0"><span style={{ marginRight: "30px" }}>Duración del Vuelo:</span> <span style={{ fontWeight: "bold" }}>{element.duracionTexto}</span></p>
                    <p className="m-0"><span style={{ marginRight: "9px" }}>Capacidad Contratada:</span> <span style={{ fontWeight: "bold" }}>{element.capacidad} paquete(s)</span></p>
                    <p className="m-0"><span style={{ marginRight: "30px" }}>Ocupación Efectiva:</span> <span style={{ fontWeight: "bold" }}>{element.ocupado}/{element.capacidad} paquete(s) ({Math.round((element.ocupado*100/element.capacidad)*10)/10}% usado)</span></p>
                    <p className="m-0"><span style={{ marginRight: "25px" }}>#Envíos Trasladados:</span> <span style={{ fontWeight: "bold" }}>{element.envios.length}</span></p>
                    <p style={{ fontWeight: "bold", margin: "3px 0px 5px 20px" }}><u>Envíos:</u></p>
                    
                    {element.envios.map((elem) => (
                      <div style={{ marginLeft: "20px", marginBottom: "3px" }}>
                        <div className="bloqueTitularPDF2" >
                          <img src={RedexEnvio} height="15px" width="15px"/>
                          <p className="m-0" style={{ paddingLeft: "10px", fontWeight: "bold" }}><span style={{ marginRight: "15px" }}>Envío <u>'{elem.codigo}'</u>:</span> {elem.numeroPaquetes} paquete(s)</p>
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
      <Modal
        open={openModal}
        onClose={cerrarModal}
      >
        <Box sx={{ ...modalStyle, borderRadius: 5 }}>
          <div className = "container">
            <div className = "col opdia-titulo-modal">
              <h2>Simulación Finalizada</h2>
            </div>
            <div className = "col opdia-mensaje-modal">
              <li>Inicio de simulación: {cadenaFechaInicio}</li>
              <li>Fin de simulación: {clock}</li>
              <li>Tiempo total de simulación: {tiempoTranscurrido}</li>
              <li>Envíos atendidos: {enviosAtendidosFin}</li>
              <li>Envíos totales: {envios.length}</li>
            </div>
          </div>
          <div className = "container">
            <div className = "row">
              <div className = "col-sm">
                <span 
                  className="w-100" 
                  onClick = {() => {
                    if(pdfExportComponentEnvio.current){
                      pdfExportComponentEnvio.current.save();
                    }
                  }}
                >
                  <RedirectButton text="Exportar detalle de envíos"/>
                </span>
              </div>
              <div className = "col-sm">
                <span 
                  className="w-100" 
                  onClick = {() => {
                    if(pdfExportComponentVuelo.current){
                      pdfExportComponentVuelo.current.save();
                    }
                  }}
                >
                  <RedirectButton text="Exportar detalle de vuelos"/>
                </span>
              </div>
              <div className = "col-sm">
                <span 
                  className="w-100"
                >
                  <Button text="Aceptar" color="greenBox" link="/Simulador"/>
                </span>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
    </>
  );

  const mapaSimulador = (
    <>
    <div className="col-md-7 p15 h-100">
      <div className="grayBox shadowBox h-100 opdia-relative">
      <span className="has-legend">
        <div ref={mapContainer} className="map-container" />
        
          <Legend />
          {inicia>0 && 
          <div className="reloj">
            <div className="reloj-texto">{clock}<hr className="linea-reloj"></hr>{tiempoTranscurrido}</div>
          </div>}
        
      </span>
      </div>
    </div>
    </>
  );

  useEffect(() => {
    if(finSimulacion){
      copiaFin = true;
      clearInterval(cada10Min);
      clearInterval(cadaHora);
      clearInterval(cadaVuelo);
      clearInterval(cadaEnvio);
      clearInterval(cadaEnvioFin);
      setOpenModal(true);
    }
    
  }, [finSimulacion]);

  useEffect(() => {
    if(inicia>0){
      verRutasAviones();
    }
    
  }, [checked]);

  useEffect(() => {
    let idMin, idHour, idPaq, idEnv, idFinEnv, difFechas, difDD, difHH, difMM, options;
    if(iniciaSimu>0){
      map.current.addSource("daynight", {
        type: "geojson",
        data: new GeoJSONTerminator(options={
          resolution:2,
          time: fechaSimu
        })
      });

      map.current.addLayer({
        id: "daynight",
        type: "fill",
        source: "daynight",
        layout: {},
        paint: {
          "fill-color": "#000",
          "fill-opacity": 0.3,
        },
      });
    
      idMin = setInterval(() => {
        setFechaSimu(new Date(fechaSimu.setMinutes(fechaSimu.getMinutes()+10)));
        difFechas = fechaSimu.getTime() - fechaZero.getTime();
        difMM = (difFechas / (1000 * 60)) % 60;
        difHH = (difFechas / (1000 * 60 * 60)) % 24;
        difDD = (difFechas / (1000 * 60 * 60 * 24)) % 365;
        if(Math.trunc(difDD) == diasSimu){
          setFinSimulacion(true);
        }
        setTiempoTranscurrido(`${Math.trunc(difDD)}d ${Math.trunc(difHH)}h ${Math.trunc(difMM)}m`);
        let [yyyy,mm,dd,hh,mi] = fechaSimu.toISOString().split(/[/:\-T]/);
        setClock(`${dd}/${mm}/${yyyy} ${hh}:${mi}`);
      }, 2500);

      idHour = setInterval(() => {
        if(map.current.getLayer("daynight")){
          map.current.getSource("daynight").setData(new GeoJSONTerminator(options={
            resolution:2,
            time: fechaSimu
          }));
        }
      }, 15000);

      idPaq = setInterval(() => {
        let vuelosLong=vuelos.length, i=0, compFecha=(fechaSimu.getTime()+18000000);
        
        console.log(vuelosLong, indexVuelo);
        for(i=indexVuelo; i < vuelosLong; i++){
          if(vuelos[i].fechaPartidaUTC<=compFecha){
            vuelosEnMapa(i);
          }else{
            break;
          }
        }
        indexVuelo=i;
        console.log(indexVuelo);
      }, 15000);

      idEnv = setInterval(() => {
        let j=0, enviosLong=envios.length, compFecha=(fechaSimu.getTime()+18000000);

        console.log(enviosLong, indexEnvio);
        for(j=indexEnvio; j<enviosLong; j++){
          if(envios[j].fechaEnvioUTC<=compFecha){
            almacenarEnAeropuerto(envios[j].idPartida, envios[j].paquetes);
          }else{
            break;
          }
        }
        indexEnvio=j;
        console.log(indexEnvio);
      }, 15000);

      idFinEnv = setInterval(() => {
        let enviosAux=enviosAtendidosFin, enviosArr=[];
        enviosFin.forEach((element) => {
          if(element.fechaFin<=(fechaSimu.getTime()+18000000)){
            enviosAux++;
            enviosAtendidosFin++;
            enviosEnProcesoFin--;
            retirarDeAeropuerto(element.idDestino, element.paquetes);
          }else{
            enviosArr.push(element);
          }
        });
        if(enviosAux>enviosAtendidosFin){
          //setEnviosEnProceso(enviosEnProceso-(enviosAux-enviosAtendidos));
          //setEnviosAtendidos(enviosAux);
          enviosFin.splice(0,enviosFin.length);
          enviosFin = [];
          enviosFin = enviosArr;
          console.log('disminuye '+enviosArr.length);
        }
      }, 15000);

      setCadaHora(idHour);
      setCada10Min(idMin);
      setCadaVuelo(idPaq);
      setCadaEnvio(idEnv);
      setCadaEnvioFin(idFinEnv);
    }
    
  }, [iniciaSimu]);

  useEffect(() => {
    if(inicia>0){
      indexVuelo+=1;
      indexEnvio+=1;
      let date = new Date(fechaInicio), dateZ = new Date(fechaInicio);
      date.setHours(0,0,0);
      date = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
      dateZ.setHours(0,0,0);
      dateZ = new Date(new Date(dateZ).getTime() - new Date(dateZ).getTimezoneOffset() * 60000);
      setFechaZero(dateZ);
      setFechaSimu(date);
      copiaFechaSimu = date;
      let [yyyy,mm,dd,hh,mi] = date.toISOString().split(/[/:\-T]/);
      setClock(`${dd}/${mm}/${yyyy} ${hh}:${mi}`);
      setTiempoTranscurrido(`0d 0h 0m`);
      setIniciaSimu(iniciaSimu+1);
    }
    
  }, [inicia]);

  useEffect(() => {
    if(htmlAeropuertos.length>0 && aeroEventosCargados==0){
      setAeroEventosCargados(aeroEventosCargados+1);
      setInicia(inicia+1);
    }
    
  }, [htmlAeropuertos]);

  useEffect(() => {
    if(aeropuertos.length>0 && aeropuertosCargados==0){
      setearAeropuertosEnMapa();
      setAeropuertosCargados(aeropuertosCargados+1);
    }
    
  }, [aeropuertos]);

  useEffect(() => {
    if(envios.length>0){
      //console.log(envios);
    }
    
  }, [envios]);

  useEffect(() => {
    if(enviosReporte.length>0){
      //console.log(enviosReporte);
    }
    
  }, [enviosReporte]);

  useEffect(() => {
    if(vuelosReporte.length>0){
      console.log(vuelosReporte);
    }
    
  }, [vuelos]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitud, lat],
      zoom: zoom,
      dragRotate: false,
    });

    //evitar copias horizontales del mundo
    map.current.setRenderWorldCopies(false);

    //cargar imagen de aviones para los posteriores vuelos
    map.current.loadImage(airplaneImage,
      (error, image) => {
      if (error) throw error;
        
      // Add the image to the map style.
      map.current.addImage('myAirplane', image, {
        "sdf": "true"
      });
    });

    (async () => {
      setAeropuertos(await getAeropuertos());
    })();
  }, []);

  return(
    <>
    <ToastContainer theme="dark" />
    <div className="row h-100">
      {enviosEstadisticas}
      {mapaSimulador}
    </div>
    </>
  );
}

export default Simulador;