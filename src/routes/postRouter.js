const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();



// Routers - /posts
// Read posts
postRouter.get("/", postController.postAll);
postRouter.get("/:authorId", postController.postByAuthorId);

// Create posts - every post must have an author
postRouter.post("/", postController.postCreate);

// Update posts - 
postRouter.put("/:authorId/:postId", postController.postUpdate);

// Delete posts - deleting, in fact, is setting publish to false
postRouter.delete("/:postId", postController.postDelete);



module.exports = postRouter;