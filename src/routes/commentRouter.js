const { Router } = require("express");
const commentController = require("../controllers/commentController");
const { auth } = require("../config/passport");

const commentRouter = Router();



// Routers - /posts
// Read comments
commentRouter.get("/:postId/comments", commentController.commentByPostId);

// Create comment - only visitor can comment for now...
commentRouter.post("/:postId/comments", auth, commentController.commentCreate);

// Update? Not available

// Delete comment - editing a comment won't be available
commentRouter.delete("/:postId/comments/:commentId", auth, commentController.commentDelete);



module.exports = commentRouter;