import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import GeoJSONTerminator from "@webgeodatavore/geojson.terminator";

const Map = (props) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_KEY;
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.dragRotate.disable();
    new mapboxgl.Marker().setLngLat([-77.1, -12.02]).addTo(map);
    new mapboxgl.Marker().setLngLat([-3.565295, 40.479901]).addTo(map);
    map.on("load", function () {
      var geoJSON = new GeoJSONTerminator();
      map.addLayer({
        id: "daynight",
        type: "fill",
        source: {
          type: "geojson",
          data: geoJSON,
        },
        layout: {},
        paint: {
          "fill-opacity": 0.1,
        },
      });
    });
    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapContainer} className="map-container" />
    </>
  );
};

export default Map;
