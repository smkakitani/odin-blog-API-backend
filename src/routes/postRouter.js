const { Router } = require("express");
const postController = require("../controllers/postController");

const postRouter = Router();



// Routers - /api/post
postRouter.get("/", postController.postsAll);




module.exports = postRouter;