const { Router } = require("express");
const authorRouter = require("./authorRouter");
const postRouter = require("./postRouter");

const indexRouter = Router();



// Routers - /api
indexRouter.get("/", (req, res) => res.send("Hello! From Blog API :3"));

indexRouter.use("/author", authorRouter);
indexRouter.use("/post", postRouter);



module.exports = indexRouter;