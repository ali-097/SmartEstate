import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";

const icon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapComponent({ onLocationSelect }) {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onLocationSelect(`${lat}, ${lng}`);
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onLocationSelect]);

  return markerPosition ? (
    <Marker position={markerPosition} icon={icon}>
      <Popup>You selected this location</Popup>
    </Marker>
  ) : null;
}

function MyMapComponent({ onLocationSelect }) {
  return (
    <MapContainer
      center={[33.6995, 73.0363]}
      zoom={13}
      className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 shadow-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapComponent onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}

export default MyMapComponent;
