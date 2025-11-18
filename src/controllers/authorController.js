// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");



// 
async function authorGetAll(req, res) {
  const authorAll = await prisma.author.findMany();

  res.json(authorAll);
}

async function authorAdd(req, res) {
  // await prisma.author.create({

  // });
  res.send("adding a new author...");
}

async function authorById(req, res) {
  const authorId = await prisma.author.findUniqueOrThrow(authorId);
  console.log(authorId);

  res.json({ "msg": `searching for author ID: ${req.params.authorId}`});
}



module.exports = {
  authorGetAll,
  authorById,
  authorAdd,
};