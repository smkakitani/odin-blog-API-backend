// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");



// 
async function postsAll(req, res) {
  const allPosts = await prisma.post.findMany();

  res.json(allPosts);
}




module.exports = {
  postsAll,
};