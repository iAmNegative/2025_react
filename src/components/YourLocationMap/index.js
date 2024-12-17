import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './YourLocationMap.css'; // Import the CSS file
import L from 'leaflet';
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";

// Define a custom icon
const customIcon = L.icon({
  iconUrl: 'https://res.cloudinary.com/dxto4jh8k/image/upload/v1734172415/thumbnail_1734172303355_a614809a82.png', 
  iconSize: [38, 50], 
  iconAnchor: [19, 38], 
  popupAnchor: [0, -38],
});

const YourLocationMap = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          setError(err.message || "Failed to retrieve location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (position && mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(position, 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      const marker = L.marker(position, { icon: customIcon }).addTo(mapInstance.current);
      marker.bindPopup(`You are here!`).openPopup();
    } else if (mapInstance.current) {
      mapInstance.current.setView(position, 16);
    }
  }, [position]);

  return (
    <Container>
      <CustomNav />
      <div className="map-container">
        {position ? (
          <div ref={mapRef} className="map-container"></div>
        ) : error ? (
          <div className="message-container error">
            <h2>Error: {error}</h2>
            <p>Please ensure location services are enabled and reload the page.</p>
          </div>
        ) : (
          <div className="message-container loading">
            <h2>Loading your location...</h2>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default YourLocationMap;
