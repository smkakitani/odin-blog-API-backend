const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();



// Routers - /posts
// Read posts
postRouter.get("/", postController.postAll);

// Create posts - every post must have an author
postRouter.post("/", postController.postCreate);

// Update posts - how to set published on frontend?
postRouter.put("/:authorId/:postId", postController.postUpdate);

// Post > Comments
postRouter.get("/:postId/comments", postController.commentPost);

// Read post 
postRouter.get("/:authorId/:postId", postController.postById);

// Delete posts - deleting, in fact, is setting publish to false
postRouter.delete("/:postId", postController.postDelete);







module.exports = postRouter;