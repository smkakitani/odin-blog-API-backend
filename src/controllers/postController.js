// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const { Prisma } = require("../../generated/prisma");
const { validatePost, validationResult, matchedData } = require("../utils/validation");



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

async function postByAuthorId(req, res, next) {
  try {
    const authorId = Number(req.params.authorId);

    if (!Number.isInteger(authorId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid author ID.",
      });
    }

    // Check if author ID exists
    const author = await prisma.author.findUnique({
      where: {
        id: authorId,
      }
    });

    if (!author) {
      return res.status(404).json({
        status: 404,
        errMsg: "Author not found.",
      });
    }

    // Get all posts from that author
    const post = await prisma.post.findMany({
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

    res.json(post);
  } catch (err) {
    next(err);
  }
}

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
      
      res.status(201).json({status: 201, post: newPost});
    } catch (err) {
      next(err);
    }
  }
];

async function postUpdate(req, res, next) {
  try {
    // Should get author's ID by request or params?
    const author = req.user;
    const { postId, authorId } = req.params;
    const { title, content, published } = req.body;

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

    const updatedPost = await prisma.post.update({
      where: { 
        authorId: {
          equals: author.id,
        },
        id: Number(postId)
      },
      data: {
        title,
        content,
        published: (published === "yes"), // Any other value sets published to FALSE
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

async function postDelete(req, res, next) {
  // Setting published to false
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid post ID.",
      });
    }

    const delPost = await prisma.post.update({
      where: { id: postId },
      data: { published: false }
    });

    res.json(delPost);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({ 
          status: 404,
          errMsg: `${err.meta.modelName} with ID: ${req.params.postId} not found.`,
        });
      }
    }
  }
}



module.exports = {
  postAll,
  postByAuthorId,
  postCreate,
  postUpdate,
  postDelete,
};