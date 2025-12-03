// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const {Prisma} = require("../../generated/prisma");



// 
async function commentByPostId(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    // console.log('comments: ',req.params);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid post ID.",
      });
    }

    // Check if post exists
    const isPost = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!isPost) {
      return res.status(404).json({
        status: 404,
        errMsg: "Post ID not found."
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        post: {
          is: {
            id: postId,
          }
        }
      }
    });

    res.json(comments);
  } catch (err) {
    next(err);
  }
}

const commentCreate = [
  // validateComment,
  async (req, res, next) => {
    // Need to define where to get user's ID, req.user or req.params
    const { content } = req.body;
    const postId = Number(req.params.postId);
    const user = req.user;

    if (!Number.isInteger(postId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid post ID.",
      });
    }

    // Check if user is author
    if (typeof user.id === "number") {
      return res.status(400).json({
        status: 400,
        errMsg: "Author comment under construction..."
      });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        usernameId: user.id,
        content: content,
      }
    });

    // res.json({postId,user, /* comment */ content});
    res.json(comment);
  }
];

async function commentDelete(req, res) {
  try {
    const commentId = req.params.commentId;
    const postId = Number(req.params.postId);
    console.log("deleting comment?", req.params)

    if (!Number.isInteger(postId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid post ID.",
      });
    }

    // const delComment = await prisma.post.update({
    //   where: { id: postId },
    //   data: {
    //     comments: {
    //       deleteMany: [{ id: commentId }]
    //     }
    //   },
    //   include: {
    //     comments: true,
    //   }
    // });

    const delComment = await prisma.comment.deleteMany({
      where: {
        postId: {
          equals: postId,
        },
        id: commentId
      }
    });

    if (delComment.count === 0) {
      return res.status(404).json({
        status: 404,
        errMsg: "Comment not found."
      });
    } else if (delComment.count > 1) {
      return res.status(666).json({
        status: 666,
        errMsg: "Huh-oh... more than 1 comment deleted...",
      });
    }

    res.json({ status: 204, message: "Comment deleted."});
  } catch (err) {
    next(err);
    // console.error(err);
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     return res.status(404).json({
    //       status: 404,
    //       errMsg: `Could not find ${err.meta.modelName}.`
    //     });
    //   }
    // }
  }
}



module.exports = {
  commentByPostId,
  commentCreate,
  commentDelete,
};