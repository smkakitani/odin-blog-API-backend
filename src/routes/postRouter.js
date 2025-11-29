const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();



// Routers - /posts
// Read posts
postRouter.get("/", postController.postAll);

// Create posts - every post must have an author
postRouter.post("/", postController.postCreate);

// Update posts - 
postRouter.put("/:authorId/:postId", postController.postUpdate);



// Post > Comments
// Read comments
postRouter.get("/:postId/comments", postController.commentPost);

// Create comment
postRouter.post("/:postId/comments", postController.commentCreate);

// Delete comment - editing a comment won't be available
postRouter.delete("/:postId/comments/:commentId", postController.commentDelete);




// Read post 
postRouter.get("/:authorId/:postId", postController.postById);

// Delete posts - deleting, in fact, is setting publish to false
postRouter.delete("/:postId", postController.postDelete);







module.exports = postRouter;