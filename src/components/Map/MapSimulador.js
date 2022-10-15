import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'; // Load worker code separately with worker-loader
import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";
import Legend from "../Legend/Legend";
import * as turf from "@turf/turf";

mapboxgl.workerClass = MapboxWorker;

const MapSimulador = (props) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [aeropuertos2, setAeropuertos] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);

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

  const origin = [-122.414, 37.776];
  const destination = [-77.032, 38.913];

  //declarar la línea para recorrer
  const route = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [origin, destination],
        },
      },
    ],
  };

  //el punto que estará en animación, comienza en 'origin'
  const point = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: origin,
        },
      },
    ],
  };

  const lineDistance = turf.length(route.features[0]);
  const arc = [];
  const steps = 500;

  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  }

  route.features[0].geometry.coordinates = arc;
  let counter = 0;

  function animate() {
    const start =
      route.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];
    const end =
      route.features[0].geometry.coordinates[
        counter >= steps ? counter : counter + 1
      ];
    if (!start || !end) return;

    point.features[0].geometry.coordinates =
      route.features[0].geometry.coordinates[counter];

    point.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.current.getSource("point").setData(point);

    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter = counter + 1;
  }

  const getAeropuertos = () => {
        /*axios.get(
            USUARIO_API_BASE_URL + 'especialidad/list')
            .then(response => {
                setAeropuertos(response.data);
            })
            .catch(error => {
                values.mensaje = 'Fallo al listar aeropuertos';
            })*/
    }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      dragRotate: false,
    });

    getAeropuertos();

    setTimeout(() => {

        aeropuertos.forEach(element => {
            new mapboxgl.Marker({ color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6) })
            .setLngLat([element.lng, element.lat])
            .addTo(map.current);
        })

        new mapboxgl.Marker({ color: 'grey' })
        .setLngLat(origin)
        .addTo(map.current);

        new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(destination)
        .addTo(map.current);

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

        setTimeout(() => {
            animate(counter);
        }, 2000);
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
