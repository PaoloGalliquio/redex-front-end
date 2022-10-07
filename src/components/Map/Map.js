import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";
import Legend from "../Legend/Legend";
import * as turf from "@turf/turf";

const Map = (props) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const map = new mapboxgl.Map({
  //   container: mapContainer.current,
  //   style: "mapbox://styles/mapbox/streets-v11",
  //   center: [lng, lat],
  //   zoom: zoom,
  // });

  const origin = [-122.414, 37.776];
  const destination = [-77.032, 38.913];

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

    map.getSource("point").setData(point);

    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter = counter + 1;
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

    // map.on("load", function () {
    //   var geoJSON = new GeoJSONTerminator();
    //   map.addLayer({
    //     id: "daynight",
    //     type: "fill",
    //     source: {
    //       type: "geojson",
    //       data: geoJSON,
    //     },
    //     layout: {},
    //     paint: {
    //       "fill-opacity": 0.1,
    //     },
    //   });
    // });
    // return () => map.remove();
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

export default Map;
