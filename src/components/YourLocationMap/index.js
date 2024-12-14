import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './YourLocationMap.css'; // Import the CSS file
import L from 'leaflet';
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";

// Define a custom icon
const customIcon = L.icon({
  iconUrl: 'https://res.cloudinary.com/dxto4jh8k/image/upload/v1734172415/thumbnail_1734172303355_a614809a82.png', // Replace with your image URL
  iconSize: [38, 50], // Adjust icon size [width, height]
  iconAnchor: [19, 38], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -38], // Position of the popup relative to the icon anchor
});

const YourLocationMap = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Ensure map is initialized only once

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("Latitude:", pos.coords.latitude, "Longitude:", pos.coords.longitude);
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setError(err.message || "Failed to retrieve location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!position && error) {
      console.log("Using fallback location.");
      setPosition([51.505, -0.09]); // Default to London
    }
  }, [error]);

  useEffect(() => {
    if (position && mapRef.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapRef.current).setView(position, 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Add custom marker
      const marker = L.marker(position, { icon: customIcon }).addTo(mapInstance.current);
      marker.bindPopup(`You are here!`).openPopup();
    } else if (mapInstance.current) {
      // Update map view if position changes
      mapInstance.current.setView(position, 13);
    }
  }, [position]);

  return (
    <Container>
      <CustomNav />
      <div className="map-container">
        {position ? (
          <div ref={mapRef} className="map-container"></div>
        ) : error ? (
          <div className="message-container">
            <h2>Error: {error}</h2>
            <p>Please ensure location services are enabled and reload the page.</p>
          </div>
        ) : (
          <div className="message-container">
            <h2>Loading your location...</h2>
          </div>
        )}
      </div>
    </Container>
  );
};

export default YourLocationMap;
