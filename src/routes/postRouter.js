const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();



// Routers - /posts
postRouter.get("/", postController.postAll);

postRouter.get("/:authorId/:postId", postController.postById);

// postRouter.get("/:postId/comments", postController.postComments);



module.exports = postRouter;