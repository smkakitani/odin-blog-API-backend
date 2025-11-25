const { Router } = require("express");
const visitorController = require("../controllers/visitorController");

const visitorRouter = Router();



// Routers - /api/visitors
visitorRouter.get("/", visitorController.visitorAll);

visitorRouter.get("/:authorId", visitorController.visitorById);



module.exports = visitorRouter;