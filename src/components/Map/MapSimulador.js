import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // Load worker code separately with worker-loader
import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";
import Legend from "../Legend/Legend";
import * as turf from "@turf/turf";
import "./MapSimulador.css";
import airportImage from "../../images/newAirport.png";
import airplaneImage from "../../images/avion2.png";

import { getAeropuertos } from "../../services/Aeropuertos";
import { getVuelos } from "../../services/Vuelos";
import { simulatorInitial } from "../../services/Simulator";
import { simulatorPerBlock } from "../../services/Simulator";
import { restartBlock } from "../../services/Simulator";

mapboxgl.workerClass = MapboxWorker;
let copiaFin=false;
let copiaFechaSimu = new Date();

const MapSimulador = ({inicia, setInicia, fechaInicio, dias, fin, setFin, fechaSimu, setFechaSimu, clock, setClock, tiempoTranscurrido, setTiempoTranscurrido, vuelos, setVuelos, envios, setEnvios, poblarEnvios, enviosEnProceso, setEnviosEnProceso, enviosAtendidos, setEnviosAtendidos, totalPaquetes, setTotalPaquetes, enviosFin, setEnviosFin}) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [longitud, setlongitud] = useState(-27.490544872911897);
  const [lat, setLat] = useState(21.104512028667855);
  const [zoom, setZoom] = useState(1.8);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [htmlAeropuertos, setHtmlAeropuertos] = useState([]);
  const [iniciaSimu, setIniciaSimu] = useState(0);
  const [planificador, setPlanificador] = useState(1);
  const [fechaZero, setFechaZero] = useState(new Date());
  const [cadaHora, setCadaHora] = useState(-1);
  const [cada10Min, setCada10Min] = useState(-1);
  const [previosInterval, setPreviousInterval] = useState(-1);
  const [currentInterval, setCurrentInterval] = useState(-1);
  const [aeropuertosCargados, setAeropuertosCargados] = useState(0);
  const [aeroEventosCargados, setAeroEventosCargados] = useState(0);
  const [indexVuelo, setIndexVuelo] = useState(-1);
  const [indexEnvio, setIndexEnvio] = useState(-1);

  const [aeropuertos, setAeropuertos] = useState([]);
  let ocupadoAero = [];
  const [vuelosProgramados, setVuelosProgramados] = useState([]);

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

  function ordenarFechas( a, b ) {
    if ( a.fechaPartidaUTC.getTime() < b.fechaPartidaUTC.getTime() ){
      return -1;
    }
    if ( a.fechaPartidaUTC.getTime() > b.fechaPartidaUTC.getTime() ){
      return 1;
    }
    return 0;
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
      /*if(vuelos[index].fechaDestinoUTC.getTime()<=(copiaFechaSimu.getTime()+18000000)){
        despacharVuelos(index, route, point);
        break;
      }*/
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
      
      /*
      NO BORRAR, artificio q puede resultar útil
      setFin((valor) => {
        if(valor){
          termina=true;
        }
        return valor;
      });*/
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
    //retirarDeAeropuerto(vuelos[index].idPartida, vuelos[index].ocupado);

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

    /*
    //posible solucion si no se muestran todos los aviones
    this.map.addSource(`example-source`, <any>{
      type: 'geojson',
      data: exampleData,
      tolerance: 0
    });
    */

    /*map.current.addLayer({
      id: "route"+index,
      source: "route"+index,
      type: "line",
      paint: {
        "line-width": 1,
        "line-color": "#1a638a"
      }
    });*/

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
      //para modificar la descripción en los popups
      //e.features[0].properties.description = 'cambio a <b>'+Math.random()+'</b>';
      const description = e.features[0].properties.description;
      //para cambiar el color en los iconos
      //map.current.setPaintProperty('points', 'icon-color', '#124d12');

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
      arrayHtml[element.id-1].style.width = `15px`;
      arrayHtml[element.id-1].style.height = `15px`;
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
        //actualizar descripcion del aeropuerto
        //description = 'cambio a <b>'+Math.random()+'</b>';
        //actualizar color del aeropuerto de acuerdo a la capacidad
        //el.style.filter = 'invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)';
      });

      //evento personalizado: al llegar un avion, actualiza la cantidad de paquetes en el almacen en el aeropuerto arribado
      arrayHtml[element.id-1].addEventListener("updateCant", (e) => {
        //console.log('soy '+element.codigo + " y han llegado " + e.detail.cantidad + " paquetes");
        ocupadoAero[element.id-1] += e.detail.cantidad;
        descColor = element.capacidad*0.75<ocupadoAero[element.id-1] ? "#fa0202" :
        element.capacidad*0.50<ocupadoAero[element.id-1] ? "#f79205" :
        element.capacidad*0.25<ocupadoAero[element.id-1] ? "#f6fa02" : "#25c71a";
        description = `Aeropuerto <b style="font-weight:800;">${element.codigo}</b> (<b style="font-weight:800;">${UTC}</b>)<br><hr style="margin: 0; border-top: black 3px solid;">Capacidad: <b style="font-weight:800;">${element.capacidad}</b> paquetes<br>Uso efectivo: ${ocupadoAero[element.id-1]}/${element.capacidad} <b style="font-weight:800; background: ${descColor};">(${Math.round((ocupadoAero[element.id-1]*100/element.capacidad)*10)/10}% en uso)</b>`;
        arrayHtml[element.id-1].style.filter = element.capacidad*0.75<ocupadoAero[element.id-1] ? "invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)" :
        element.capacidad*0.50<ocupadoAero[element.id-1] ? "invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)" :
        element.capacidad*0.25<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)";
      });

      //retirar envio
      arrayHtml[element.id-1].addEventListener("envioEnd", (e) => {
        ocupadoAero[element.id-1] -= e.detail.cantidad;
        descColor = element.capacidad*0.75<ocupadoAero[element.id-1] ? "#fa0202" :
        element.capacidad*0.50<ocupadoAero[element.id-1] ? "#f79205" :
        element.capacidad*0.25<ocupadoAero[element.id-1] ? "#f6fa02" : "#25c71a";
        description = `Aeropuerto <b style="font-weight:800;">${element.codigo}</b> (<b style="font-weight:800;">${UTC}</b>)<br><hr style="margin: 0; border-top: black 3px solid;">Capacidad: <b style="font-weight:800;">${element.capacidad}</b> paquetes<br>Uso efectivo: ${ocupadoAero[element.id-1]}/${element.capacidad} <b style="font-weight:800; background: ${descColor};">(${Math.round((ocupadoAero[element.id-1]*100/element.capacidad)*10)/10}% en uso)</b>`;
        arrayHtml[element.id-1].style.filter = element.capacidad*0.75<ocupadoAero[element.id-1] ? "invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)" :
        element.capacidad*0.50<ocupadoAero[element.id-1] ? "invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)" :
        element.capacidad*0.25<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)";
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      // Add markers to the map.
      new mapboxgl.Marker(arrayHtml[element.id-1])
        .setLngLat([element.longitud, element.latitud])
        .addTo(map.current);

      //#25c71a: verde, #f6fa02: amarillo, #f79205:naranja, #fa0202:rojo
      //verde: invert(38%) sepia(100%) saturate(1028%) hue-rotate(85deg) brightness(106%) contrast(96%)
      //amarillo: invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)
      //naranja: invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)
      //rojo: invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)
      //codeColor to filter: https://codepen.io/sosuke/pen/Pjoqqp
    });
    setHtmlAeropuertos(arrayHtml);
  };

  useEffect(() => {
    if(fin){
      console.log('acabado');
      clearInterval(cada10Min);
      clearInterval(cadaHora);
    }
    
  }, [fin]);

  useEffect(() => {
    if(indexVuelo>=0 && indexVuelo<vuelos.length && vuelos.length>0){
      if(vuelos[indexVuelo].fechaPartidaUTC.getTime()<=(fechaSimu.getTime()+18000000)){
        vuelosEnMapa(indexVuelo);
        setIndexVuelo(indexVuelo+1);
      }
    }
    if(indexEnvio>=0 && indexEnvio<envios.length && envios.length>0){
      if(envios[indexEnvio].fechaEnvioUTC.getTime()<=(fechaSimu.getTime()+18000000)){
        setTotalPaquetes(totalPaquetes+envios[indexEnvio].paquetes);
        almacenarEnAeropuerto(envios[indexEnvio].idPartida, envios[indexEnvio].paquetes);
        setEnviosEnProceso(enviosEnProceso+1);
        setIndexEnvio(indexEnvio+1);
      }
    }
    /*if(fechaSimu.getTime()%3600000==0 && fechaZero.getTime()<fechaSimu.getTime()){
      let options, compFechaSimu = fechaSimu.getTime()+18000000;
      if(map.current.getLayer("daynight")){
        map.current.getSource("daynight").setData(new GeoJSONTerminator(options={
          resolution:2,
          time: fechaSimu
        }));
      }
      for(let i=0; i<vuelos.length; i++){
        if(vuelos[i].fechaPartidaUTC.getTime()<=compFechaSimu && vuelos[i].estado == 0){
          vuelos[i].estado = 1;
          vuelosEnMapa(i);
        }
      }
      for(let i=0; i<enviosFin.length; i++){
        if(enviosFin[i].fechaFin.getTime()<=compFechaSimu && enviosFin[i].estado == 0){
          enviosFin[i].estado = 1;
          setEnviosEnProceso(enviosEnProceso-1);
          setEnviosAtendidos(enviosAtendidos+1);
          retirarDeAeropuerto(envios[i].idDestino, envios[i].paquetes);
        }
      }
    }*/
    
  }, [indexVuelo, indexEnvio, fechaSimu]);

  useEffect(() => {
    let idMin, idHour, difFechas, difDD, difHH, difMM, options;
    if(iniciaSimu>0){
      console.log(vuelos);
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
        if(Math.trunc(difDD) == dias){
          console.log('termino');
          copiaFin = true;
          setFin(!fin);
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

      setCadaHora(idHour);
      setCada10Min(idMin);
    }
    
  }, [iniciaSimu]);

  useEffect(() => {
    if(vuelosProgramados.length>0){
      let datePartida, datePartidaUTC, dateDestino, dateDestinoUTC, datePartidaTexto, dateDestinoTexto;
      let yyyy,mm,dd,hh,mi;
      let vuelosPreparados = [];
      vuelosProgramados.forEach((element) => {
        datePartida = new Date(new Date(element.fechaPartida).getTime() + new Date(element.fechaPartida).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaPartida).toISOString().split(/[/:\-T]/);
        datePartidaTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        datePartidaUTC = new Date(new Date(element.fechaPartidaUTC0).getTime() + new Date(element.fechaPartidaUTC0).getTimezoneOffset() * 60000);
        dateDestino = new Date(new Date(element.fechaDestino).getTime() + new Date(element.fechaDestino).getTimezoneOffset() * 60000);
        dateDestinoUTC = new Date(new Date(element.fechaDestinoUTC0).getTime() + new Date(element.fechaDestinoUTC0).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaDestino).toISOString().split(/[/:\-T]/);
        dateDestinoTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        vuelosPreparados.push({
          fechaPartida: datePartida,
          fechaPartidaTexto: datePartidaTexto,
          fechaPartidaUTC: datePartidaUTC,
          fechaDestino: dateDestino,
          fechaDestinoTexto: dateDestinoTexto,
          fechaDestinoUTC: dateDestinoUTC,
          duracion: Math.round((element.duracion*2500/10)/20), //20   o    Math.round((element.duracion*1.6/10)*10)/10,
          duracionTexto: `${String(Math.trunc(element.duracion/60)).padStart(2,'0')}:${String(element.duracion%60).padStart(2,'0')} hrs.`,
          capacidad: element.capacidad,
          ocupado: 10, //100   o   element.capacidad - element.capacidadActual,
          idPartida: element.aeropuertoPartida.id-1,
          idDestino: element.aeropuertoDestino.id-1,
          estado: 0 //0: no atendido, 1: en vuelo, 2: termina
        });
      });
      //vuelosPreparados.splice(0, 300);
      vuelosPreparados.splice(30);
      setVuelos(vuelosPreparados);
      
    }
    
  }, [vuelosProgramados]);

  useEffect(() => {
    if(inicia>0){
      setIndexVuelo(indexVuelo+1);
      setIndexEnvio(indexEnvio+1);
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
      /*(async () => {
        setVuelosProgramados(await getVuelos());
      })().then(() => {
        
      });*/
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
      //setVuelosProgramados(await getVuelos());
    })();
  }, []);

  return (
    <>
      <span className="has-legend">
        <div ref={mapContainer} className="map-container" />
        
          <Legend />
          {inicia>0 && 
          <div className="reloj">
            <div className="reloj-texto">{clock}<hr className="linea-reloj"></hr>{tiempoTranscurrido}</div>
          </div>}
        
      </span>
    </>
  );
};

export default MapSimulador;
