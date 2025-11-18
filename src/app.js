// Environment variables
// import "dotenv/config";
require("dotenv").config();

// Server
// import express from "express";
// import cors from "cors";
const express = require("express");
const cors = require("cors");

// Import routers
// import indexRouter from "./routes/indexRouter.js";
// import authorRouter from "./routes/authorRouter.js";
const indexRouter = require("./routes/indexRouter");
// const authorRouter = require("./routes/authorRouter");

const app = express();



// Cross-Origin Resource Sharing
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));



// Routers
// app.use("/api", indexRouter);
// app.use("/api/author", authorRouter);
app.use("/api", indexRouter);



// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Blog API - listening on port ${PORT} :3`);
});