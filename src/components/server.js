import React, { useState, useEffect } from "react";



const express = require("express");
const cors = require("cors"); // Import the cors middleware

const app = express();

// Use the cors middleware to allow requests from all origins during development
app.use(cors());

// ... Other middleware and route setup ...

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
