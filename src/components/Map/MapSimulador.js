import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // Load worker code separately with worker-loader
import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";
import Legend from "../Legend/Legend";
import * as turf from "@turf/turf";
import "./MapSimulador.css";
import myImage from "../../images/torre.png";

import { getAeropuertos } from "../../services/Aeropuertos";

mapboxgl.workerClass = MapboxWorker;

const MapSimulador = (props) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [longitud, setlongitud] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);
  const mapContainer = useRef(null);
  const map = useRef(null);
  var geoJSON = new GeoJSONTerminator();

  const [aeropuertos, setAeropuertos] = useState([
    {
      id: 1,
      codigo: 'SKBO',        
      latitud: 4.704457625807202,
      longitud: -74.14592553862266
      },
      {
      id: 2,
      codigo: 'SEQM',
      latitud: -0.12060877412654421,
      longitud: -78.36038245001657
      },
      {
      id: 3,
      codigo: 'SVMI',
      latitud: 10.603585774287888,
      longitud: -66.99926476931259
      },
      {
      id: 4,
      codigo: 'SBBR',
      latitud: -15.867744180870947,
      longitud: -47.9170702850104
      },
      {
      id: 5,
      codigo: 'SPIM',
      latitud: -12.021386327455675,
      longitud: -77.11223668106244
      },
      {
      id: 6,
      codigo: 'SLLP',
      latitud: -16.5080229674137,
      longitud: -68.18832159557982
      },
      {
      id: 7,
      codigo: 'SCEL',
      latitud: -33.38526198149922,
      longitud: -70.79533826282814
      },
      {
      id: 8,
      codigo: 'SABE',
      latitud: -34.55619741712162,
      longitud: -58.41682447234023
      },
      {
      id: 9,
      codigo: 'SGAS',
      latitud: -25.239659530183463,
      longitud: -57.51424786952118
      },
      {
      id: 10,
      codigo: 'SUAA',
      latitud: -34.78692639523177,
      longitud: -56.26113988232748
      },
      {
      id: 11,
      codigo: 'LATI',
      latitud: 41.4209817952829,
      longitud: 19.71327991181606
      },
      {
      id: 12,
      codigo: 'EDDI',
      latitud: 52.48351662691871,
      longitud: 13.388972479586295
      },
      {
      id: 13,
      codigo: 'LOWW',
      latitud: 48.11524377772697,
      longitud: 16.57502442375078
      },
      {
      id: 14,
      codigo: 'EBCI',
      latitud: 50.46387289916686,
      longitud: 4.459408105873757
      },
      {
      id: 15,
      codigo: 'UMMS',
      latitud: 53.89367910728258,
      longitud: 28.033559281483136
      },
      {
      id: 16,
      codigo: 'LBSF',
      latitud: 42.69628213861569,
      longitud: 23.40786669999999
      },
      {
      id: 17,
      codigo: 'LKPR',
      latitud: 50.10643253372774,
      longitud: 14.262667601907156
      },
      {
      id: 18,
      codigo: 'LDZA',
      latitud: 45.74210504730452,
      longitud: 16.06740629403184
      },
      {
      id: 19,
      codigo: 'EKCH',
      latitud: 55.614567319376846,
      longitud: 12.646925088713543
      },
      {
      id: 20,
      codigo: 'LZIB',
      latitud: 48.17213285086396,
      longitud: 17.210418470988174
      },
      {
      id: 21,
      codigo: 'LJLJ',
      latitud: 46.22821450233051,
      longitud: 14.455699722911326
      },
      {
      id: 22,
      codigo: 'LEMD',
      latitud: 40.49952332657222,
      longitud: -3.567769861360249
      },
      {
      id: 23,
      codigo: 'EETN',
      latitud: 59.41725887730289,
      longitud: 24.80033350503511
      },
      {
      id: 24,
      codigo: 'EFHK',
      latitud: 60.321789519609084,
      longitud: 24.948512787169907
      },
      {
      id: 25,
      codigo: 'LFPG',
      latitud: 49.01353604427941,
      longitud: 2.551239313841362
      },
      {
      id: 26,
      codigo: 'LGAV',
      latitud: 37.93897092592914,
      longitud: 23.948353338704067
      },
      {
      id: 27,
      codigo: 'EHAM',
      latitud: 52.312571254314875,
      longitud: 4.76846916344911
      },
      {
      id: 28,
      codigo: 'LHBP',
      latitud: 47.440387265365715,
      longitud: 19.252291034123
      },
      {
      id: 29,
      codigo: 'EIDW',
      latitud: 53.42782445522474,
      longitud: -6.250544859231624
      },
      {
      id: 30,
      codigo: 'BIKF',
      latitud: 63.98278871892899,
      longitud: -22.62826032202545
      },
      {
      id: 31,
      codigo: 'LIRA',
      latitud: 41.80076628382644,
      longitud: 12.592924321405766
      },
      {
      id: 32,
      codigo: 'EVRA',
      latitud: 56.92318434838864,
      longitud: 23.973243050746508
      },
      {
      id: 33,
      codigo: 'ELLX',
      latitud: 49.629888059730796,
      longitud: 6.214778561912179
      },
      {
      id: 34,
      codigo: 'LMML',
      latitud: 35.85370564095991,
      longitud: 14.48668827717019
      },
      {
      id: 35,
      codigo: 'ENGM',
      latitud: 60.19883955623137,
      longitud: 11.099930511792262
      },
      {
      id: 36,
      codigo: 'EPMO',
      latitud: 52.44991829138718,
      longitud: 20.65111449261625
      },
      {
      id: 37,
      codigo: 'LPPT',
      latitud: 38.776165600572774,
      longitud: -9.135459995633068
      },
      {
      id: 38,
      codigo: 'EGLL',
      latitud: 51.4715284787471,
      longitud: -0.45449582855018344
      },
      {
      id: 39,
      codigo: 'ESKN',
      latitud: 58.78968375571363,
      longitud: 16.91538633907585
      },
      {
      id: 40,
      codigo: 'LSZB',
      latitud: 46.91260059480198,
      longitud: 7.4989953374621265
      }
  ]);

  let nroVuelos=0;
  let vueloListo=1;
  const vuelos = [];

  const origin = [-122.414, 37.776];
  const destination = [-77.032, 38.913];

  //declarar la línea para recorrer
  let route = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [origin, destination]
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
        properties: {},
        geometry: {
          type: "Point",
          coordinates: origin
        }
      }
    ]
  };

  const steps = 500;
  let counter = 0;

  function animate() {
    const start =
      route.features[nroVuelos-1].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];
    const end =
      route.features[nroVuelos-1].geometry.coordinates[
        counter >= steps ? counter : counter + 1
      ];
    if (!start || !end) {
      counter=0;
      return;
    }

    point.features[nroVuelos-1].geometry.coordinates =
      route.features[nroVuelos-1].geometry.coordinates[counter];

    point.features[nroVuelos-1].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.current.getSource("point").setData(point);
    map.current.getSource("route").setData(route);

    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter = counter + 1;
  }

  const trazarRutas = (index) => {
    const lineDistance = turf.length(route.features[index]);
    let arc = [];
    const steps = 100;

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[index], i);
      arc.push(segment.geometry.coordinates);
    }

    route.features[index].geometry.coordinates = arc;
    //let counter = 0;

    setTimeout(() => {
      //animate(counter, index);
      //animacion(counter, index);
      animate(counter);
    }, 1000);
  }

  const setearAeropuertosEnMapa = () => {
    aeropuertos.forEach(element => {
        let description = `<b>${element.codigo}</b> (GMT-)<br>Capacidad: 100`;
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${myImage})`;
        el.style.filter = 'invert(19%) sepia(19%) saturate(3817%) hue-rotate(85deg) brightness(96%) contrast(88%)';
        el.style.width = `25px`;
        el.style.height = `25px`;
        el.style.backgroundSize = '100%';

        //al posar el cursor sobre el ícono de aeropuerto..
        el.addEventListener('mouseenter', () => {
          popup.setLngLat([element.longitud, element.latitud]).setHTML(description).addTo(map.current);
        });

        //al retirar el cursor sobre el ícono de aeropuerto...
        el.addEventListener('mouseleave', () => {
          popup.remove();
          //actualizar descripcion del aeropuerto
          //description = 'cambio a <b>'+Math.random()+'</b>';
          //actualizar color del aeropuerto de acuerdo a la capacidad
          //el.style.filter = 'invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)';
        });

        //al clickear sobre el ícono de aeropuerto...
        //adicionalment, se podría configurar algún evento que se active cuando se actualicen cantidades
        el.addEventListener('click', () => {

          if(vueloListo == 1){
            //selecciona punto de origen
            //agregar vuelo
            vuelos.push({
              id: nroVuelos+1,
              idPartida: element.id-1,
              idDestino: 0
            });

            //en la espera del punto de destino
            vueloListo++;
          }else if(vueloListo == 2){
            let index = nroVuelos;
            //selecciona punto de destino
            vuelos[nroVuelos].idDestino = element.id-1;
            
            //se reinicia la cuenta
            nroVuelos++;
            vueloListo = 1;
            setTimeout(() => {
              //console.log(aeropuertos[vuelos[nroVuelos-1].idPartida].codigo+' -> '
              //+aeropuertos[vuelos[nroVuelos-1].idDestino].codigo);
              if(nroVuelos>1){
                route.features.push({
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: [[aeropuertos[vuelos[nroVuelos-1].idPartida].longitud,aeropuertos[vuelos[nroVuelos-1].idPartida].latitud],[aeropuertos[vuelos[nroVuelos-1].idDestino].longitud,aeropuertos[vuelos[nroVuelos-1].idDestino].latitud]]
                  }
                });

                point.features.push({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [aeropuertos[vuelos[nroVuelos-1].idPartida].longitud,aeropuertos[vuelos[nroVuelos-1].idPartida].latitud]
                  }
                });


              }else{
                //1er vuelo
                route.features[0].geometry.coordinates = [[aeropuertos[vuelos[nroVuelos-1].idPartida].longitud,aeropuertos[vuelos[nroVuelos-1].idPartida].latitud],[aeropuertos[vuelos[nroVuelos-1].idDestino].longitud,aeropuertos[vuelos[nroVuelos-1].idDestino].latitud]];
                point.features[0].geometry.coordinates = [aeropuertos[vuelos[nroVuelos-1].idPartida].longitud,aeropuertos[vuelos[nroVuelos-1].idPartida].latitud];
              }
              trazarRutas(index);
            }, 1000);
          }
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });
        
        // Add markers to the map.
        new mapboxgl.Marker(el)
        .setLngLat([element.longitud, element.latitud])
        .addTo(map.current);

        //#124d12: verde, #f6fa02: amarillo, #fa0202:rojo
        //verde: invert(19%) sepia(19%) saturate(3817%) hue-rotate(85deg) brightness(96%) contrast(88%)
        //amarillo: invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)
        //rojo: invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)
        //codeColor to filter: https://codepen.io/sosuke/pen/Pjoqqp
    })
  }

  useEffect(() => {
    /*(async () => {
      setAeropuertos(await getAeropuertos());
    })();*/

    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitud, lat],
      zoom: zoom,
      dragRotate: false
    });

    //evitar copias horizontales del mundo
    map.current.setRenderWorldCopies(false);

    setTimeout(() => {
      setearAeropuertosEnMapa();

      map.current.addLayer({
        'id': 'daynight',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': geoJSON
        },
        'layout': {},
        'paint': {
            'fill-color': '#000',
            'fill-opacity': 0.2
        }
      });

      map.current.addSource('route', {
          'type': 'geojson',
          'data': route
          });
          
      map.current.addSource('point', {
          'type': 'geojson',
          'data': point
      });
          
      map.current.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'paint': {
              'line-width': 2,
              'line-color': '#007cbf'
          }
      });
          
      map.current.addLayer({
          'id': 'point',
          'source': 'point',
          'type': 'symbol',
          'layout': {
              'icon-image': 'airport-15',
              'icon-size': 2,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true
          }
      });
    }, 2000);
  }, []);

  return (
    <>
      <span className="has-legend">
        <div ref={mapContainer} className="map-container" />
        <Legend />
      </span>
    </>
  );
};

export default MapSimulador;
