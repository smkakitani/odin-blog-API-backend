const { Router } = require("express");
const postController = require("../controllers/postController");

// Authentication
const { auth } = require("../config/passport");

const postRouter = Router();



// Routers - /posts
// Read posts
postRouter.get("/", postController.posts);
postRouter.get("/:authorId", auth, postController.postByAuthorId);

// Create posts - every post must have an author
postRouter.post("/", auth, postController.postCreate);

// Update posts - 
postRouter.put("/:authorId/:postId", auth, postController.postUpdate);

// Delete posts - deleting, in fact, is setting publish to false
postRouter.delete("/:postId", auth, postController.postDelete);



module.exports = postRouter;