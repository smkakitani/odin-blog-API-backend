// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const {Prisma} = require("../../generated/prisma");



// 
async function postAll(req, res, next) {
  try {
    // If post doesn't exist, it'll return an empty array
    const allPosts = await prisma.post.findMany();

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
      }
    });

    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function postCreate(req, res, next) {
  try {
    // Validate post first!!!
    // Using TinyMCE - need to know how to handle it
    const author = req.user;
    const { title, content } = req.body;
    // console.log( author, typeof author.id === "number");

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

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: author.id
      }
    });
    
    res.status(201).json({status: 201, newPost});
  } catch (err) {
    // console.error('Creating post: ', err);
    next(err);
  }
}

async function postUpdate(req, res, next) {
  try {
    // Should get author's ID by request or params?
    const author = req.user;
    const { postId, authorId } = req.params;
    const { title, content, published } = req.body;
    // Published?
    // console.log(postId, authorId);

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
      }
    });

    res.json({ status: 200, post: updatedPost });
  } catch (err) {
    // console.error(err);
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