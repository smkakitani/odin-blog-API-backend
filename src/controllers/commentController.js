// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
// Validation
const { 
  validateComment,  
  validatePostParams,
  validateCommParams, 
  validationResult, 
  matchedData,  
} = require("../utils/validation");



// 
const commentByPostId = [
  validatePostParams,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid parameters.",
          err: errors.array(),
        });
      }

      // Check if post exists
      const { postId } = matchedData(req);
      const isPost = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!isPost) {
        return res.status(404).json({
          status: 404,
          errMsg: "Post ID not found."
        });
      }

      // Post > comments > user
      const comments = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          comments: {
            include: {
              username: {
                select: {
                  username: true,
                  email: true,
                }
              }
            }
          }
        }
      });

      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
];

const commentCreate = [
  validatePostParams,
  validateComment,
  async (req, res, next) => {
    try {
      // Need to define where to get user's ID, req.user or req.params
      const user = req.user;
      const errors = validationResult(req);

      if (!errors.isEmpty() && errors.mapped()?.postId) {
          // Filtering errors of parameters field
          const allErrors = errors.array();        
          const paramsErrors = allErrors.filter(error => error.location === "params");

          return res.status(400).json({
            status: 400,
            errMsg: "Invalid parameters.",
            err: paramsErrors,
          });
      } else if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: errors.array(),
        });
      }

      // Check if user is author - under construction @_@
      if (typeof user.id === "number") {
        return res.status(400).json({
          status: 400,
          errMsg: "Author comment under construction..."
        });
      }

      // Check if post exist
      const { postId, content } = matchedData(req);
      const isPost = await prisma.post.findMany({
        where: { id: { equals: postId }}
      });

      if (isPost.length === 0) {
        return res.status(404).json({
          status: 404,
          errMsg: "Post not found."
        });
      }

      const comment = await prisma.comment.create({
        data: {
          postId: postId,
          usernameId: user.id,
          content: content,
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      res.json(comment);
    } catch (err) {
      next(err)
    }
    
  }
];

const commentDelete = [
  validateCommParams,
  validatePostParams,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty() && (errors.mapped()?.postId || errors.mapped()?.commentId)) {
          // Filtering errors of parameters field
          const allErrors = errors.array();        
          const paramsErrors = allErrors.filter(error => error.location === "params");

          return res.status(400).json({
            status: 400,
            errMsg: "Invalid parameters.",
            err: paramsErrors,
          });
      } else if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: errors.array(),
        });
      }

      // Check
      const { postId, commentId } = matchedData(req);
      const isPost = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!isPost) {
        return res.status(404).json({
          status: 404,
          errMsg: "Post not found.",
        });
      }

      const isComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      console.log('deleting comment -> ',isComment);

      if (!isComment) {
        return res.status(404).json({
          status: 404,
          errMsg: "Comment not found.",
        });
      }

      // 
      const deletedData = prisma.comment.findMany({
        where: {
          postId: {
            equals: postId,
          },
          id: commentId
        }
      });

      const delComment = prisma.comment.deleteMany({
        where: {
          postId: {
            equals: postId,
          },
          id: commentId
        }
      });

      const transaction = await prisma.$transaction([deletedData, delComment]);
      res.json({
        status: 200,
        comment: isComment,
      });
    } catch (err) {
      next(err);
    }
  }
];



module.exports = {
  commentByPostId,
  commentCreate,
  commentDelete,
};