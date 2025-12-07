const { Router } = require("express");
const authorController = require("../controllers/authorController")

const authorRouter = Router();



// Routers - /authors
// Read authors
authorRouter.get("/", authorController.authorAll);
authorRouter.get("/:authorId", authorController.authorById);

// Create/Sign up author ---> indexRouter

// Update author
authorRouter.put("/:authorId", authorController.authorEdit);

// Delete author... should not remove the only author
authorRouter.delete(["/:authorId", "/:authorEmail"], authorController.authorDelete);



module.exports =  authorRouter;