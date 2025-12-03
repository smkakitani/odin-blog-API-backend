const { Router } = require("express");
const indexController = require("../controllers/indexController");

// JWT
// const { verifyToken } = require("../config/passport");
const passport = require("passport");
const { jwtStrategy } = require("../config/passport");

// Routers
const authorRouter = require("./authorRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const visitorRouter = require("./visitorRouter");

// 
const indexRouter = Router();
passport.use(jwtStrategy);



// Routers - /api?
indexRouter.get("/", (req, res) => res.send("Hello! From Blog API :3"));

// Sign up & log in/out
indexRouter.post("/sign-up/author", indexController.authorSignUp);
indexRouter.post("/sign-up", indexController.visitorSignUp)
indexRouter.post("/log-in", indexController.logIn);
// When the user logs out, you can have the client remove the JWT from localStorage.
indexRouter.get("/log-out", indexController.logOut);



// API routers
indexRouter.use("/authors", passport.authenticate("jwt", { session:false }), authorRouter);
indexRouter.use("/posts", passport.authenticate("jwt", { session: false }), postRouter);
indexRouter.use("/posts", passport.authenticate("jwt", { session: false }), commentRouter);
indexRouter.use("/visitors", passport.authenticate("jwt", { session: false }), visitorRouter);



module.exports = indexRouter;