const { Router } = require("express");
const indexController = require("../controllers/indexController");

// JWT
const { auth } = require("../config/passport");

// Routers
const authorRouter = require("./authorRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const visitorRouter = require("./visitorRouter");

// 
const indexRouter = Router();



// Routers
/* indexRouter.get("/", (req, res) => res.send("Hello! From Blog API :3")); */

// Sign up & log in
indexRouter.post("/sign-up/author", indexController.authorSignUp);
indexRouter.post("/sign-up", indexController.visitorSignUp);
indexRouter.post("/log-in", indexController.logIn);



// API routers
indexRouter.use("/authors", authorRouter);
indexRouter.use("/posts", postRouter);
indexRouter.use("/posts", commentRouter);
indexRouter.use("/visitors", auth, visitorRouter);



module.exports = indexRouter;