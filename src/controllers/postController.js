// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const { Prisma } = require("../../generated/prisma");
const { 
  validatePost, 
  validatePostParams, 
  validateAuthorParams, 
  validationResult, 
  matchedData 
} = require("../utils/validation");



// 
async function postAll(req, res, next) {
  try {
    // If post doesn't exist, it'll return an empty array
    const allPosts = await prisma.post.findMany({
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    res.json(allPosts);
  } catch (err) {
    next(err);
  }  
}

const postByAuthorId = [
  validateAuthorParams,
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

      // Check if author ID exists
      const { authorId } = matchedData(req);
      const isAuthor = await prisma.author.findUnique({
        where: {
          id: authorId,
        }
      });

      if (!isAuthor) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }

      // Get all posts from author
      const posts = await prisma.post.findMany({
        where: { 
          author: {
            is: {
              id: authorId,
            }
          }
        },
        include: {
          _count: {
            select: { comments: true },
          }
        }
      });

      res.json(posts);
    } catch (err) {
      next(err);
    }
  }
];

const postCreate = [
  validatePost,
  async (req, res, next) => {
    try {
      // Using TinyMCE to populate content - 
      const author = req.user;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: errors.array(),
        });
      }

      if (typeof author.id !== "number") {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }

      const isAuthor = await prisma.author.findUnique({
        where: { id: author.id }
      });

      if (!isAuthor) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }

      // 
      const { title, content } = matchedData(req);

      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId: author.id
        },
        include: {
          author: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              bio: true,
            },
          }
        }
      });
      
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }
];

const postUpdate = [  
  validatePostParams,
  validateAuthorParams,
  validatePost,
  async (req, res, next) => {
    try {
      const author = req.user;
      const errors = validationResult(req);

      if (!errors.isEmpty() && (errors.mapped()?.authorId || errors.mapped()?.postId)) {
        // Filtering errors of parameters field
        const allErrors = errors.array();        
        const paramsErrors = allErrors.filter(error => error.location === "params");

        return res.status(400).json({
          status: 400,
          errMsg: "Invalid parameters.",
          err: paramsErrors,
        });
      } else if (!errors.isEmpty()) {
        // Errors of body field
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: errors.array(),
        });
      }

      // Check author & post
      const { postId, authorId } = matchedData(req, { locations: ["params"] });
      const isAuthor = await prisma.author.findUnique({
        where: { id: authorId }
      });
      const isPost = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!isAuthor) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      } else if (!isPost) {
        return res.status(404).json({
          status: 404,
          errMsg: "Post not found.",
        });
      }

      // 
      const { title, content, published } = matchedData(req, { locations: ["body"] });

      const updatedPost = await prisma.post.update({
        where: { 
          authorId: {
            equals: author.id,
          },
          id: postId
        },
        data: {
          title,
          content,
          published: (published === "yes") || Prisma.skip,
        },
        include: {
          _count: {
            select: { comments: true },
          }
        }
      });

      res.json({ status: 200, post: updatedPost });
    } catch (err) {
      next(err);
    }
  }
];

const postDelete = [
  validatePostParams,
  async (req, res, next) => {
    // Set published to false
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty() && errors.mapped()?.postId) {
        // Filtering errors of parameters field
        const allErrors = errors.array();        
        const paramsErrors = allErrors.filter(error => error.location === "params");

        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: paramsErrors,
        });
      }

      // 
      const { postId } = matchedData(req);

      const delPost = await prisma.post.update({
        where: { id: postId },
        data: { published: false },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          _count: {
            select: {
              comments: true,
            }
          }
        }
      });

      res.json(delPost);
    } catch (err) {
      next(err);
    }
  }
];



module.exports = {
  postAll,
  postByAuthorId,
  postCreate,
  postUpdate,
  postDelete,
};