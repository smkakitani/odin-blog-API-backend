const { Router } = require("express");
const indexController = require("../controllers/indexController");

// JWT
// const { verifyToken } = require("../config/passport");
const passport = require("passport");
const { jwtStrategy } = require("../config/passport");

// Routers
const authorRouter = require("./authorRouter");
const postRouter = require("./postRouter");
const visitorRouter = require("./visitorRouter");



const indexRouter = Router();
passport.use(jwtStrategy);



// Routers - /api?
indexRouter.get("/", (req, res) => res.send("Hello! From Blog API :3"));

// Sign up
indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/log-in", indexController.logIn);
// indexRouter.get("/log-out", indexController.logOut);
// indexRouter.get("/log-out", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.send("logging out...");
//   })
// });



// 
indexRouter.use("/authors", authorRouter);
indexRouter.use("/posts", (req, res, next) => {
  console.log("calling from /posts");
  next();
},passport.authenticate(
  "jwt", {
    session: false
  }
), postRouter);

indexRouter.use("/visitors", visitorRouter);



module.exports = indexRouter;