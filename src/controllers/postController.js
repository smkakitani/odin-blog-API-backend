// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const {Prisma} = require("../../generated/prisma");



// 
async function postAll(req, res) {
  try {
    const allPosts = await prisma.post.findMany();

    res.json(allPosts);
  } catch (err) {
    console.error(err);
  }  
}

async function postById(req, res) {
  try {
    const { authorId, postId } = req.params;
    console.log(authorId, postId);

    const post = await prisma.post.findUniqueOrThrow({
      where: { 
        authorId: Number(authorId),
        id: Number(postId) 
      }
    });

    res.json(post);
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

async function postCreate(req, res, next) {
  try {
    // Validate post first!!!
    const author = req.user;
    const { title, content } = req.body;

    const result = await prisma.post.create({
      data: {
        authorId: Number(author.id),
        title,
        content,
      },
      select: { title: true, content: true, author: true }
    });
    
    res.json(result);
  } catch (err) {
    console.error('Creating post: ', err);
  }
}

async function postUpdate(req, res, next) {
  try {
    const author = req.user;
    const postId = req.params.postId;
    const { title, content } = req.body;
    // Published?

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        published
      }
    });

    res.json(post);
  } catch (err) {
    console.error(err);
  }
}

async function postDelete(req, res, next) {
  try {
    const postId = req.params.postId;

    await prisma.post.update({
      where: { id: Number(postId) },
      data: { published: "false" }
    });

    res.json({
      
    });
  } catch (err) {
    console.error(err);
  }
}



// Comments section
async function commentPost(req, res, next) {
  try {
    const postId = req.params.postId;

    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) }
    });

    res.json({
      postId: postId,
      comments: comments,
    });
  } catch (err) {
    console.error(err);
  }
}

const commentCreate = [
  // validateComment,
  async (req, res, next) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const user = req.user;

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        usernameId: user.id,
        content: content,
      }
    });

    res.json({postId,user, comment});
  }
];

async function commentDelete(req, res) {
  try {
    const { postId, commentId } = req.params;
    console.log("deleting comment?", req.params)

    const delComment = await prisma.comment.delete({
      where: { id: commentId },
      select: { 
        usernameId: true,
        postId: true,
      }
    });

    res.json({postId, commentId, delComment});
  } catch (err) {
    // console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          status: 404,
          errMsg: `Could not find ${err.meta.modelName}.`
        });
      }
    }
  }
}



module.exports = {
  postAll,
  postById,
  postCreate,
  postUpdate,
  postDelete,
  // 
  commentPost,
  commentCreate,
  commentDelete,
};