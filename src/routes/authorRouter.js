const { Router } = require("express");
const authorController = require("../controllers/authorController");
const { auth } = require("../config/passport");

const authorRouter = Router();



// Routers - /authors
// Read authors
authorRouter.get("/", authorController.authorAll);
authorRouter.get("/:authorId", auth, authorController.authorById);

// Create/Sign up author ---> indexRouter

// Update author
authorRouter.put("/:authorId", auth, authorController.authorEdit);

// Delete author... should not remove the only author
authorRouter.delete(["/:authorId", "/:authorEmail"], auth, authorController.authorDelete);



module.exports =  authorRouter;