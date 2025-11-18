const { Router } = require("express");
const authorController = require("../controllers/authorController")

const authorRouter = Router();



// Routers - /api/author
authorRouter.get("/", authorController.authorGetAll);
authorRouter.post("/", authorController.authorAdd);

authorRouter.get("/:authorId", authorController.authorById);




module.exports =  authorRouter;