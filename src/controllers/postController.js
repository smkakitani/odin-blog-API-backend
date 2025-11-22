// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const {Prisma} = require("../../generated/prisma");



// 
async function postAll(req, res) {
  const allPosts = await prisma.post.findMany();
  // console.log("from posts: ",req.headers);

  res.json(allPosts);
}

async function postById(req, res) {
  try {
    const id = req.params.postId;

    const post = await prisma.post.findUniqueOrThrow({
      where: { id: Number(id) }
    });

    res.json(post);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // console.log("error is instanceof prisma :D", err.code, err.meta);
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
  postById,
};