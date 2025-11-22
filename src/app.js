// Environment variables
require("dotenv").config();

// Server
const express = require("express");
const cors = require("cors");
// const session = require("express-session");
// const passport = require("passport");
// const passport = require("./config/passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const jwtStrategy = require("./config/passport");

// Config imports
// const prisma = require("./config/database");
// require("./config/passport")(passport); // Pass the global passport object into the configuration function

// Import routers
const indexRouter = require("./routes/indexRouter");

const app = express();



// Cross-Origin Resource Sharing
app.use(cors());
/* app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
})); */

// Enable req.body to parse client's output
// app.use(express.json()) // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Prisma session store
/* app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    })
})); */

// Passport auth
// app.use(passport.session());
// app.use(passport.)
// passport.use(jwtStrategy);

// Custom middleware to access current user
app.use((req, res, next) => {
  // res.currentUser = req.user;

  // console.log(req.session);
  // console.log('from main: ',req.logout);
  // console.log(req.body);
  next();
});



// Routers
// app.use("/api", indexRouter);
// app.use("/api/author", authorRouter);
app.use("/", indexRouter);



// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Blog API - listening on port ${PORT} :3`);
});