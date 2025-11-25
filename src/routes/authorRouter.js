const { Router } = require("express");
const authorController = require("../controllers/authorController")

const authorRouter = Router();



// Routers - /api?/authors
// Read author/authors
authorRouter.get("/", authorController.authorAll);
authorRouter.get("/:authorId", authorController.authorById);

// Create/Sign up author ---> indexRouter

// Update author
authorRouter.put("/:authorId", authorController.authorEdit);

// Post can only be created with within a author?
// authorRouter.post("/:authorId", authorController.author)

// Delete author... should not remove the only author
authorRouter.delete(["/:authorId", "/:authorEmail"], authorController.authorDelete);



module.exports =  authorRouter;