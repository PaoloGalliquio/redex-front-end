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

mapboxgl.workerClass = MapboxWorker;

const MapSimulador = ({inicia, fechaInicio}) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [longitud, setlongitud] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [clock, setClock] = useState();
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState();
  const [htmlAeropuertos, setHtmlAeropuertos] = useState([]);
  const [iniciaSimu, setIniciaSimu] = useState(0);
  const [fechaSimu, setFechaSimu] = useState(new Date());
  const [fechaZero, setFechaZero] = useState(new Date());
  const [previosInterval, setPreviousInterval] = useState(-1);
  const [currentInterval, setCurrentInterval] = useState(-1);
  const [aeropuertosCargados, setAeropuertosCargados] = useState(0);
  const [aeroEventosCargados, setAeroEventosCargados] = useState(0);
  const [indexVuelo, setIndexVuelo] = useState(-1);

  /*const [aeropuertos, setAeropuertos] = useState([
    {
      id: 1,
      codigo: "SKBO",
      latitud: 4.704457625807202,
      longitud: -74.14592553862266,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 2,
      codigo: "SEQM",
      latitud: -0.12060877412654421,
      longitud: -78.36038245001657,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 3,
      codigo: "SVMI",
      latitud: 10.603585774287888,
      longitud: -66.99926476931259,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 4,
      codigo: "SBBR",
      latitud: -15.867744180870947,
      longitud: -47.9170702850104,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 5,
      codigo: "SPIM",
      latitud: -12.021386327455675,
      longitud: -77.11223668106244,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 6,
      codigo: "SLLP",
      latitud: -16.5080229674137,
      longitud: -68.18832159557982,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 7,
      codigo: "SCEL",
      latitud: -33.38526198149922,
      longitud: -70.79533826282814,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 8,
      codigo: "SABE",
      latitud: -34.55619741712162,
      longitud: -58.41682447234023,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 9,
      codigo: "SGAS",
      latitud: -25.239659530183463,
      longitud: -57.51424786952118,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 10,
      codigo: "SUAA",
      latitud: -34.78692639523177,
      longitud: -56.26113988232748,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 11,
      codigo: "LATI",
      latitud: 41.4209817952829,
      longitud: 19.71327991181606,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 12,
      codigo: "EDDI",
      latitud: 52.48351662691871,
      longitud: 13.388972479586295,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 13,
      codigo: "LOWW",
      latitud: 48.11524377772697,
      longitud: 16.57502442375078,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 14,
      codigo: "EBCI",
      latitud: 50.46387289916686,
      longitud: 4.459408105873757,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 15,
      codigo: "UMMS",
      latitud: 53.89367910728258,
      longitud: 28.033559281483136,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 16,
      codigo: "LBSF",
      latitud: 42.69628213861569,
      longitud: 23.40786669999999,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 17,
      codigo: "LKPR",
      latitud: 50.10643253372774,
      longitud: 14.262667601907156,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 18,
      codigo: "LDZA",
      latitud: 45.74210504730452,
      longitud: 16.06740629403184,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 19,
      codigo: "EKCH",
      latitud: 55.614567319376846,
      longitud: 12.646925088713543,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 20,
      codigo: "LZIB",
      latitud: 48.17213285086396,
      longitud: 17.210418470988174,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 21,
      codigo: "LJLJ",
      latitud: 46.22821450233051,
      longitud: 14.455699722911326,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 22,
      codigo: "LEMD",
      latitud: 40.49952332657222,
      longitud: -3.567769861360249,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 23,
      codigo: "EETN",
      latitud: 59.41725887730289,
      longitud: 24.80033350503511,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 24,
      codigo: "EFHK",
      latitud: 60.321789519609084,
      longitud: 24.948512787169907,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 25,
      codigo: "LFPG",
      latitud: 49.01353604427941,
      longitud: 2.551239313841362,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 26,
      codigo: "LGAV",
      latitud: 37.93897092592914,
      longitud: 23.948353338704067,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 27,
      codigo: "EHAM",
      latitud: 52.312571254314875,
      longitud: 4.76846916344911,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 28,
      codigo: "LHBP",
      latitud: 47.440387265365715,
      longitud: 19.252291034123,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 29,
      codigo: "EIDW",
      latitud: 53.42782445522474,
      longitud: -6.250544859231624,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 30,
      codigo: "BIKF",
      latitud: 63.98278871892899,
      longitud: -22.62826032202545,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 31,
      codigo: "LIRA",
      latitud: 41.80076628382644,
      longitud: 12.592924321405766,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 32,
      codigo: "EVRA",
      latitud: 56.92318434838864,
      longitud: 23.973243050746508,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 33,
      codigo: "ELLX",
      latitud: 49.629888059730796,
      longitud: 6.214778561912179,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 34,
      codigo: "LMML",
      latitud: 35.85370564095991,
      longitud: 14.48668827717019,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 35,
      codigo: "ENGM",
      latitud: 60.19883955623137,
      longitud: 11.099930511792262,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 36,
      codigo: "EPMO",
      latitud: 52.44991829138718,
      longitud: 20.65111449261625,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 37,
      codigo: "LPPT",
      latitud: 38.776165600572774,
      longitud: -9.135459995633068,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 38,
      codigo: "EGLL",
      latitud: 51.4715284787471,
      longitud: -0.45449582855018344,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 39,
      codigo: "ESKN",
      latitud: 58.78968375571363,
      longitud: 16.91538633907585,
      capacidad: 100,
      ocupado: 0
    },
    {
      id: 40,
      codigo: "LSZB",
      latitud: 46.91260059480198,
      longitud: 7.4989953374621265,
      capacidad: 100,
      ocupado: 0
    },
  ]);*/

  /*const [vuelosProgramados, setVuelosProgramados] = useState([
    {
      id: 1,
      idPartida: 0,
      idDestino: 29,
      tiempo: 20, //segundos,
      intercontinental: true,
      capacidad: 100,
      ocupado: 50
    },
    {
      id: 2,
      idPartida: 4,
      idDestino: 23,
      tiempo: 30,
      intercontinental: true,
      capacidad: 100,
      ocupado: 80
    },
    {
      id: 3,
      idPartida: 6,
      idDestino: 28,
      tiempo: 40,
      intercontinental: true,
      capacidad: 100,
      ocupado: 20
    },
    {
      id: 4,
      idPartida: 35,
      idDestino: 2,
      tiempo: 60,
      intercontinental: true,
      capacidad: 100,
      ocupado: 10
    },
    {
      id: 5,
      idPartida: 5,
      idDestino: 3,
      tiempo: 10,
      intercontinental: false,
      capacidad: 100,
      ocupado: 40
    },
    {
      id: 6,
      idPartida: 1,
      idDestino: 9,
      tiempo: 15,
      intercontinental: false,
      capacidad: 100,
      ocupado: 90
    },
    {
      id: 7,
      idPartida: 34,
      idDestino: 23,
      tiempo: 15,
      intercontinental: false,
      capacidad: 100,
      ocupado: 20
    },
    {
      id: 8,
      idPartida: 11,
      idDestino: 33,
      tiempo: 15,
      intercontinental: false,
      capacidad: 100,
      ocupado: 45
    },
    {
      id: 9,
      idPartida: 14,
      idDestino: 25,
      tiempo: 15,
      intercontinental: false,
      capacidad: 100,
      ocupado: 60
    },
    {
      id: 10,
      idPartida: 30,
      idDestino: 33,
      tiempo: 15,
      intercontinental: false,
      capacidad: 100,
      ocupado: 10
    }
  ]);*/

  const [aeropuertos, setAeropuertos] = useState([]);
  let ocupadoAero = [];
  const [vuelos, setVuelos] = useState([]);
  const [vuelosProgramados, setVuelosProgramados] = useState([]);


  function almacenarEnAeropuerto (cod, cant) {
    const event = new CustomEvent('updateCant', {
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
  
  const eliminarVuelos = (index, route, point) => {
    if(vuelos[index].ocupado>0){
      almacenarEnAeropuerto(vuelos[index].idDestino, vuelos[index].ocupado);
    }

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

  const animarVuelos = (index, route, point, counter, steps, time) => {
    setTimeout(() => {
      const start =
        route.features[0].geometry.coordinates[
          counter >= steps ? counter - 1 : counter
        ];
      const end =
        route.features[0].geometry.coordinates[
          counter >= steps ? counter : counter + 1
        ];
      if (!start || !end) {
        eliminarVuelos(index, route, point);
        return;
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
      if (counter < steps) {
        animarVuelos(index, route, point, counter, steps, time);
      }else{
        eliminarVuelos(index, route, point);
      }
    }, time);
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
    let time = 10*vuelos[index].duracion;

    setTimeout(() => {
      animarVuelos(index, route, point, counter, steps, time);
    }, 1000);
  };

  const vuelosEnMapa = (index) => {
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
      data: point
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
        "line-color": vuelos[index].intercontinental==true ? "#1a638a" : "#565902" //continental: #565902, intercontinental: #1a638a
      }
    });*/

    map.current.addLayer({
      id: "point"+index,
      source: "point"+index,
      type: "symbol",
      layout: {
        "icon-image": 'myAirplane',
        "icon-size": 0.25,
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-color": "#186a7a"
        /* vuelos[index].capacidad*0.75<vuelos[index].ocupado ? "#fa0202" :
        vuelos[index].capacidad*0.50<vuelos[index].ocupado ? "#f79205" :
        vuelos[index].capacidad*0.25<vuelos[index].ocupado ? "#f6fa02" : "#25c71a"*/
        //capacidad: [0-25]=>verde, ]25,50]=>amarillo, ]50,75]=>naranja, ]75,100]=>rojo
        //#25c71a: verde, #f6fa02: amarillo, #f79205:naranja, #fa0202:rojo
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

    trazarRutas(index, route, point, 100);
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
      element.capacidad*0.25<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(75%) sepia(53%) saturate(5119%) hue-rotate(73deg) brightness(96%) contrast(95%)";
      arrayHtml[element.id-1].style.width = `20px`;
      arrayHtml[element.id-1].style.height = `20px`;
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
        element.capacidad*0.25<ocupadoAero[element.id-1] ? "invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)" : "invert(75%) sepia(53%) saturate(5119%) hue-rotate(73deg) brightness(96%) contrast(95%)";
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
      //verde: invert(75%) sepia(53%) saturate(5119%) hue-rotate(73deg) brightness(96%) contrast(95%)
      //amarillo: invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)
      //naranja: invert(58%) sepia(33%) saturate(3553%) hue-rotate(3deg) brightness(105%) contrast(96%)
      //rojo: invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)
      //codeColor to filter: https://codepen.io/sosuke/pen/Pjoqqp
    });
    setHtmlAeropuertos(arrayHtml);
  };

  useEffect(() => {
    if(iniciaSimu>1){
      clearInterval(previosInterval);
    }
    
  }, [currentInterval]);

  useEffect(() => {
    if(indexVuelo>=0 && indexVuelo<vuelos.length && vuelos.length>0){
      if(vuelos[indexVuelo].fechaPartidaUTC.getTime()<=(fechaSimu.getTime()+18000000)){
        vuelosEnMapa(indexVuelo);
        setIndexVuelo(indexVuelo+1);
      }
    }
    if(fechaSimu.getTime()%3600000==0){
      let options;
      if(map.current.getLayer("daynight")){
        map.current.getSource("daynight").setData(new GeoJSONTerminator(options={
          resolution:2,
          time: fechaSimu
        }));
      }
    }
    
  }, [indexVuelo, fechaSimu]);

  useEffect(() => {
    let refreshId, difFechas, difDD, difHH, difMM, options;
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
          "fill-opacity": 0.2,
        },
      });
    
      refreshId = setInterval(() => {
        setFechaSimu(new Date(fechaSimu.setMinutes(fechaSimu.getMinutes()+10)));
        difFechas = fechaSimu.getTime() - fechaZero.getTime();
        difMM = (difFechas / (1000 * 60)) % 60;
        difHH = (difFechas / (1000 * 60 * 60)) % 24;
        difDD = (difFechas / (1000 * 60 * 60 * 24)) % 365;
        setTiempoTranscurrido(`${Math.trunc(difDD)}d ${Math.trunc(difHH)}h ${Math.trunc(difMM)}m`);
        let [yyyy,mm,dd,hh,mi] = fechaSimu.toISOString().split(/[/:\-T]/);
        setClock(`${dd}/${mm}/${yyyy} ${hh}:${mi}`);
      }, 1600);


      if(iniciaSimu == 1){
        setPreviousInterval(refreshId);
        setCurrentInterval(refreshId); 
      }else if(iniciaSimu>1){
        setPreviousInterval(currentInterval);
        setCurrentInterval(refreshId);
      }
    }
    
  }, [iniciaSimu]);

  useEffect(() => {
    if(vuelos.length>0){
      console.log(vuelos);
      setIndexVuelo(indexVuelo+1);
      let date = new Date(fechaInicio), dateZ = new Date(fechaInicio);
      date.setHours(0,0,0);
      date = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
      dateZ.setHours(0,0,0);
      dateZ = new Date(new Date(dateZ).getTime() - new Date(dateZ).getTimezoneOffset() * 60000);
      setFechaZero(dateZ);
      setFechaSimu(date);
      let [yyyy,mm,dd,hh,mi] = date.toISOString().split(/[/:\-T]/);
      setClock(`${dd}/${mm}/${yyyy} ${hh}:${mi}`);
      setTiempoTranscurrido(`0d 0h 0m`);
      setIniciaSimu(iniciaSimu+1);
    }
    
  }, [vuelos]);

  useEffect(() => {
    if(inicia>0){
      (async () => {
        setAeropuertos(await getAeropuertos());
      })().then(() => {
        
      });

      map.current.loadImage(airplaneImage,
        (error, image) => {
        if (error) throw error;
          
        // Add the image to the map style.
        map.current.addImage('myAirplane', image, {
          "sdf": "true"
        });
      });
    }
    
  }, [inicia]);

  useEffect(() => {
    if(vuelosProgramados.length>0){
      let datePartida, datePartidaUTC, dateDestino, datePartidaTexto, dateDestinoTexto;
      let yyyy,mm,dd,hh,mi;
      let vuelosPreparados = [];
      vuelosProgramados.forEach((element) => {
        datePartida = new Date(new Date(element.fechaPartida).getTime() + new Date(element.fechaPartida).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaPartida).toISOString().split(/[/:\-T]/);
        datePartidaTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        datePartidaUTC = new Date(new Date(element.fechaPartidaUTC0).getTime() + new Date(element.fechaPartidaUTC0).getTimezoneOffset() * 60000);
        dateDestino = new Date(new Date(element.fechaDestino).getTime() + new Date(element.fechaDestino).getTimezoneOffset() * 60000);
        [yyyy,mm,dd,hh,mi] = new Date(element.fechaDestino).toISOString().split(/[/:\-T]/);
        dateDestinoTexto = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
        vuelosPreparados.push({
          fechaPartida: datePartida,
          fechaPartidaTexto: datePartidaTexto,
          fechaPartidaUTC: datePartidaUTC,
          fechaDestino: dateDestino,
          fechaDestinoTexto: dateDestinoTexto,
          duracion: Math.round((element.duracion*1.6/10)*10)/10, //20   o    Math.round((element.duracion*1.6/10)*10)/10,
          duracionTexto: `${String(Math.trunc(element.duracion/60)).padStart(2,'0')}:${String(element.duracion%60).padStart(2,'0')} hrs.`,
          capacidad: element.capacidad,
          ocupado: element.capacidad - element.capacidadActual, //100   o   element.capacidad - element.capacidadActual,
          idPartida: element.aeropuertoPartida.id-1,
          idDestino: element.aeropuertoDestino.id-1,
          estado: 0 //0: no atendido, 1: en vuelo, 2: termina
        });
      });
      vuelosPreparados.reverse();
      vuelosPreparados.splice(0, 300);
      vuelosPreparados.splice(20);
      setVuelos(vuelosPreparados);
      
    }
    
  }, [vuelosProgramados]);

  useEffect(() => {
    if(aeropuertosCargados==1 && aeroEventosCargados==1){
      (async () => {
        setVuelosProgramados(await getVuelos());
      })().then(() => {
        
      });
    }
    
  }, [aeropuertosCargados, aeroEventosCargados]);

  useEffect(() => {
    if(htmlAeropuertos.length>0 && aeroEventosCargados==0){
      setAeroEventosCargados(aeroEventosCargados+1);
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

    /*setTimeout(() => {
      map.current.addLayer({
        id: "daynight",
        type: "fill",
        source: {
          type: "geojson",
          data: geoJSON,
        },
        layout: {},
        paint: {
          "fill-color": "#000",
          "fill-opacity": 0.2,
        },
      });

      map.current.loadImage(airplaneImage,
        (error, image) => {
        if (error) throw error;
          
        // Add the image to the map style.
        map.current.addImage('myAirplane', image, {
          "sdf": "true"
        });
      });

      //setearAeropuertosEnMapa();
      //setearVuelosEnMapa();

      setTimeout(() => {
        for(let i=0; i<aeropuertos.length; i++){
          console.log('editando');
          aeropuertos[i].ocupado += 50;
        }
        console.log(aeropuertos);
      }, 5000);
    }, 3000);*/
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
