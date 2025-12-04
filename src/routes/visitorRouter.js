const { Router } = require("express");
const visitorController = require("../controllers/visitorController");

const visitorRouter = Router();



// Routers - /api?/visitors
// Read visitors
visitorRouter.get("/", visitorController.visitorAll);
visitorRouter.get("/:username", visitorController.visitorById);

// Create/Sign up visitors ---> indexRouter

// Update visitor - password or e-mail available to edit
visitorRouter.put("/:username", visitorController.visitorEdit);

// Delete visitor
visitorRouter.delete("/:username", visitorController.visitorDelete);



module.exports = visitorRouter;