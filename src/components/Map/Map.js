import mapboxgl from "mapbox-gl";
import React, { useRef, useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css'; 

const Map = (props) => {
  mapboxgl.accessToken = "pk.eyJ1IjoibWxhdGIiLCJhIjoiY2wwbDZkYWFnMDk5eDNqcGx1eGJ4Ymp5aCJ9.cexgkWqb5orLtl-EsL6wsg";
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
    const marker = new mapboxgl.Marker().setLngLat([-77.10, -12.02]).addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapContainer} className="map-container" />
    </>
  );
};

export default Map;
