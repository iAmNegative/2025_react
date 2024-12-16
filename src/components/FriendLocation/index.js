import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './FriendLocation.css'; // Import the CSS file
import L from 'leaflet';
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";
import { API_BASE_URL } from "../../helpers";
import socket from "socket.io-client";
import { userData } from "../../helpers";
import { useParams } from "react-router-dom";

// Define a custom icon
const customIcon = L.icon({
  iconUrl: 'https://res.cloudinary.com/dxto4jh8k/image/upload/v1734172415/thumbnail_1734172303355_a614809a82.png',
  iconSize: [38, 50],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const socketInstance = socket(API_BASE_URL); // Initialize Socket.IO once

const FriendLocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("Your friend is here"); // Add a state for the dynamic message
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const loggedInUserId = userData().id; // Get the logged-in user's ID
  const { id: targetUser } = useParams();

  useEffect(() => {
    // Notify backend to find location
    socketInstance.emit("findLocationSend", { targetUser, senderUser: loggedInUserId });
    console.log(` request code 1 :  send to server `);

    // Listen for location data
    socketInstance.on("sendCordToSender", (data) => {
      const { senderUser1, targetUser1, lan, long } = data;

      console.log(`sendCordToSender: Sender user ${senderUser1}`);

      if (senderUser1 === loggedInUserId) {
        console.log(`senderUser1 === loggedInUserId: Target user ${targetUser1}, Sender user ${senderUser1}`);
        setMessage(`${targetUser1} is here!`); // Dynamically set the message with targetUser1
        setPosition([lan, long]); // Set friend's position
      }
    });
  }, [loggedInUserId, targetUser]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map once
      mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }

    if (position && mapInstance.current) {
      mapInstance.current.setView(position, 13);
      L.marker(position, { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(message) // Use the dynamic message here
        .openPopup();
    }
  }, [position, message]); // Include message as a dependency to re-render when it changes

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
            <h2>Loading friend location...</h2>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FriendLocation;
