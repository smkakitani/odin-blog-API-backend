// Environment variables
import "dotenv/config";

// Server
import express from "express";
import cors from "cors";

// Import routers
import indexRouter from "./routes/indexRouter.js";

const app = express();



// 
app.use(cors());



// Routers
app.use("/api", indexRouter);



// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Blog API - listening on port ${PORT} :3`);
});