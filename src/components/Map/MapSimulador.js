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

mapboxgl.workerClass = MapboxWorker;

const MapSimulador = (props) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);
  const mapContainer = useRef(null);
  const map = useRef(null);
  var geoJSON = new GeoJSONTerminator();

  const aeropuertos = [
    {
      id: 1,
      codigo: 'SKBO',        
      lat: 4.704457625807202,
      lng: -74.14592553862266
      },
      {
      id: 2,
      codigo: 'SEQM',
      lat: -0.12060877412654421,
      lng: -78.36038245001657
      },
      {
      id: 3,
      codigo: 'SVMI',
      lat: 10.603585774287888,
      lng: -66.99926476931259
      },
      {
      id: 4,
      codigo: 'SBBR',
      lat: -15.867744180870947,
      lng: -47.9170702850104
      },
      {
      id: 5,
      codigo: 'SPIM',
      lat: -12.021386327455675,
      lng: -77.11223668106244
      },
      {
      id: 6,
      codigo: 'SLLP',
      lat: -16.5080229674137,
      lng: -68.18832159557982
      },
      {
      id: 7,
      codigo: 'SCEL',
      lat: -33.38526198149922,
      lng: -70.79533826282814
      },
      {
      id: 8,
      codigo: 'SABE',
      lat: -34.55619741712162,
      lng: -58.41682447234023
      },
      {
      id: 9,
      codigo: 'SGAS',
      lat: -25.239659530183463,
      lng: -57.51424786952118
      },
      {
      id: 10,
      codigo: 'SUAA',
      lat: -34.78692639523177,
      lng: -56.26113988232748
      },
      {
      id: 11,
      codigo: 'LATI',
      lat: 41.4209817952829,
      lng: 19.71327991181606
      },
      {
      id: 12,
      codigo: 'EDDI',
      lat: 52.48351662691871,
      lng: 13.388972479586295
      },
      {
      id: 13,
      codigo: 'LOWW',
      lat: 48.11524377772697,
      lng: 16.57502442375078
      },
      {
      id: 14,
      codigo: 'EBCI',
      lat: 50.46387289916686,
      lng: 4.459408105873757
      },
      {
      id: 15,
      codigo: 'UMMS',
      lat: 53.89367910728258,
      lng: 28.033559281483136
      },
      {
      id: 16,
      codigo: 'LBSF',
      lat: 42.69628213861569,
      lng: 23.40786669999999
      },
      {
      id: 17,
      codigo: 'LKPR',
      lat: 50.10643253372774,
      lng: 14.262667601907156
      },
      {
      id: 18,
      codigo: 'LDZA',
      lat: 45.74210504730452,
      lng: 16.06740629403184
      },
      {
      id: 19,
      codigo: 'EKCH',
      lat: 55.614567319376846,
      lng: 12.646925088713543
      },
      {
      id: 20,
      codigo: 'LZIB',
      lat: 48.17213285086396,
      lng: 17.210418470988174
      },
      {
      id: 21,
      codigo: 'LJLJ',
      lat: 46.22821450233051,
      lng: 14.455699722911326
      },
      {
      id: 22,
      codigo: 'LEMD',
      lat: 40.49952332657222,
      lng: -3.567769861360249
      },
      {
      id: 23,
      codigo: 'EETN',
      lat: 59.41725887730289,
      lng: 24.80033350503511
      },
      {
      id: 24,
      codigo: 'EFHK',
      lat: 60.321789519609084,
      lng: 24.948512787169907
      },
      {
      id: 25,
      codigo: 'LFPG',
      lat: 49.01353604427941,
      lng: 2.551239313841362
      },
      {
      id: 26,
      codigo: 'LGAV',
      lat: 37.93897092592914,
      lng: 23.948353338704067
      },
      {
      id: 27,
      codigo: 'EHAM',
      lat: 52.312571254314875,
      lng: 4.76846916344911
      },
      {
      id: 28,
      codigo: 'LHBP',
      lat: 47.440387265365715,
      lng: 19.252291034123
      },
      {
      id: 29,
      codigo: 'EIDW',
      lat: 53.42782445522474,
      lng: -6.250544859231624
      },
      {
      id: 30,
      codigo: 'BIKF',
      lat: 63.98278871892899,
      lng: -22.62826032202545
      },
      {
      id: 31,
      codigo: 'LIRA',
      lat: 41.80076628382644,
      lng: 12.592924321405766
      },
      {
      id: 32,
      codigo: 'EVRA',
      lat: 56.92318434838864,
      lng: 23.973243050746508
      },
      {
      id: 33,
      codigo: 'ELLX',
      lat: 49.629888059730796,
      lng: 6.214778561912179
      },
      {
      id: 34,
      codigo: 'LMML',
      lat: 35.85370564095991,
      lng: 14.48668827717019
      },
      {
      id: 35,
      codigo: 'ENGM',
      lat: 60.19883955623137,
      lng: 11.099930511792262
      },
      {
      id: 36,
      codigo: 'EPMO',
      lat: 52.44991829138718,
      lng: 20.65111449261625
      },
      {
      id: 37,
      codigo: 'LPPT',
      lat: 38.776165600572774,
      lng: -9.135459995633068
      },
      {
      id: 38,
      codigo: 'EGLL',
      lat: 51.4715284787471,
      lng: -0.45449582855018344
      },
      {
      id: 39,
      codigo: 'ESKN',
      lat: 58.78968375571363,
      lng: 16.91538633907585
      },
      {
      id: 40,
      codigo: 'LSZB',
      lat: 46.91260059480198,
      lng: 7.4989953374621265
      }
  ];

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

  const getAeropuertos = () => {
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
          popup.setLngLat([element.lng, element.lat]).setHTML(description).addTo(map.current);
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
                    coordinates: [[aeropuertos[vuelos[nroVuelos-1].idPartida].lng,aeropuertos[vuelos[nroVuelos-1].idPartida].lat],[aeropuertos[vuelos[nroVuelos-1].idDestino].lng,aeropuertos[vuelos[nroVuelos-1].idDestino].lat]]
                  }
                });

                point.features.push({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [aeropuertos[vuelos[nroVuelos-1].idPartida].lng,aeropuertos[vuelos[nroVuelos-1].idPartida].lat]
                  }
                });


              }else{
                //1er vuelo
                route.features[0].geometry.coordinates = [[aeropuertos[vuelos[nroVuelos-1].idPartida].lng,aeropuertos[vuelos[nroVuelos-1].idPartida].lat],[aeropuertos[vuelos[nroVuelos-1].idDestino].lng,aeropuertos[vuelos[nroVuelos-1].idDestino].lat]];
                point.features[0].geometry.coordinates = [aeropuertos[vuelos[nroVuelos-1].idPartida].lng,aeropuertos[vuelos[nroVuelos-1].idPartida].lat];
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
        .setLngLat([element.lng, element.lat])
        .addTo(map.current);

        //#124d12: verde, #f6fa02: amarillo, #fa0202:rojo
        //verde: invert(19%) sepia(19%) saturate(3817%) hue-rotate(85deg) brightness(96%) contrast(88%)
        //amarillo: invert(82%) sepia(63%) saturate(882%) hue-rotate(11deg) brightness(113%) contrast(107%)
        //rojo: invert(21%) sepia(79%) saturate(6123%) hue-rotate(355deg) brightness(92%) contrast(116%)
        //codeColor to filter: https://codepen.io/sosuke/pen/Pjoqqp
    })
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      dragRotate: false
    });

    //evitar copias horizontales del mundo
    map.current.setRenderWorldCopies(false);

    setTimeout(() => {
      getAeropuertos();

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
