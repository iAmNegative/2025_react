import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "./FriendLocation.css"; // Updated CSS file
import L from "leaflet";
import CustomNav from "../CustomNav";
import { Container } from "reactstrap";
import { API_BASE_URL } from "../../helpers";
import socket from "socket.io-client";
import { userData } from "../../helpers";
import { useParams } from "react-router-dom";

// Define a custom icon with updated popupAnchor
const customIcon = L.icon({
  iconUrl:
    "https://res.cloudinary.com/dxto4jh8k/image/upload/v1734429885/thumbnail_Pngtree_elemental_illustrations_of_boys_standing_4186543_eaa27ce0d9.png?2024-12-17T10:04:49.633Z",
  iconSize: [48, 60],
  iconAnchor: [19, 38],   // Anchor point of the icon (where the marker is placed)
  popupAnchor: [0, -30],   // Move the popup 50px above the icon
});

const socketInstance = socket(API_BASE_URL); // Initialize Socket.IO once

const FriendLocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("Your friend is here!"); // Dynamic message state
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const loggedInUserId = userData().id; // Get the logged-in user's ID
  const { id: targetUser } = useParams();

  useEffect(() => {
    // Notify backend to find location
    socketInstance.emit("findLocationSend", { targetUser, senderUser: loggedInUserId });
    console.log(`Request code 1: Sent to server target ${targetUser}`);

    // Listen for location data
    socketInstance.on("sendCordToSender", (data) => {
      const { senderUser1, targetUserName, lan, long } = data;

      console.log(`sendCordToSender: Sender user ${senderUser1}`);

      if (senderUser1 === loggedInUserId) {
        console.log(
          `senderUser1 === loggedInUserId: Target user ${targetUserName}, Sender user ${senderUser1}`
        );
        setMessage(`${targetUserName} is here!`); // Dynamically set the message
        setPosition([lan, long]); // Set friend's position
      }
    });
  }, [loggedInUserId, targetUser]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map once
      mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);
    }

    if (position && mapInstance.current) {
      mapInstance.current.setView(position, 16);

      // Remove any existing markers
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
      });

      // Create a marker for the friend's location
      const marker = L.marker(position, { icon: customIcon }).addTo(mapInstance.current);

      // Create a popup with the message
      marker
        .bindPopup(`<b>${message}</b>`) // Bind the dynamic message to the popup
        .openPopup();

      // Ensure popup is not closable
      marker.getPopup().on('remove', function() {
        marker.openPopup(); // Keep the popup open
      });
    }
  }, [position, message]);

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
// correct code
