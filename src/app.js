// Environment variables
require("dotenv").config();

// Server
const express = require("express");
const cors = require("cors");

// Import routers
const indexRouter = require("./routes/indexRouter");

const app = express();



// Cross-Origin Resource Sharing
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  origin: process.env.LOCAL_HOST || process.env.URL_HOST, // Vite's port
}));

// Enable req.body to parse client's output
app.use(express.json()) // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// Custom middleware to access current user
// app.use((req, res, next) => {

//   // console.log(req.originalUrl);
//   next();
// });



// Routers
app.use("/", indexRouter);



// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  // console.log(`Blog API - listening on port ${PORT} :3`);
});