// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
const {Prisma} = require("../../generated/prisma");
// const { body, query, validationResult, matchedData } = require("express-validator");
const { validateAuthor, validationResult, matchedData } = require("../utils/validation");
const bcrypt = require("bcryptjs");



// 
async function authorAll(req, res) {
  const authorAll = await prisma.author.findMany();

  res.json(authorAll);
}

const authorEdit = [
  validateAuthor,
  async (req, res, next) => {
    console.log(`ID from req.user: ${typeof req.user.id} | ID from params: ${typeof req.params.authorId}`);
    // Check if user ID from req.params is same as req.user
    if (parseInt(req.user.id) !== parseInt(req.params.authorId)) {
      return res.status(400).json({
        status: 400,
        errMsg: "Different users trying to edit author data."
      });
    }

    // console.log('From edit author FIRST: ',req.user);
    next();
  }, async (req, res, next) => {
    try {
      // Check if there's user's ID in DB
      // const userId = req.params.authorId;
      const userId = req.user.id;
      console.log("calling from author edit second function");

      const author = await prisma.author.findUnique({
        where: { id: Number(userId) }
      });

      if (!author) {
        console.log("Author inexistent: ", author);
        return res.status(400).json({
          status: 404,
          errMsg: "Inexistent author's ID.",
        });
      }      

      next();
      // res.json(author);
    } catch (err) {
      console.error(err);
    }
    
  }, async (req, res, next) => {
    // Validate fields
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        status: 400,
        errMsg: "",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    // Should divide password update fields???
    // Author user's data should be displayed on front-end
    const { firstName, lastName, email, password, bio } = matchedData(req);
    console.log(firstName, lastName, email, password, bio);
    const hashPassword = await bcrypt.hash(password, 9);
    

    await prisma.author.update({
      where: { id: userId, email: userEmail },
      data: { firstName, lastName, email, password: hashPassword, bio }
    });

    res.json({ message: `updating current Author -> ${firstName}`});
  }
];

async function authorById(req, res) {
  try {
    const id = req.params.authorId;
    console.log(id);

    const author = await prisma.author.findUniqueOrThrow({
      where: { id: Number(id) }
    });
    
    // Should send password?
    res.json(author);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({ 
          status: 404,
          errMsg: `${err.meta.modelName} with ID: ${req.params.authorId} not found.`,
        });
      }
    }    
  }  
}

async function authorDelete(req, res, next) {
  try {
    const authorId = req.params.authorId;
    // By e-mail?
    const authorEmail = req.params;
    console.log(authorEmail);

    if (authorId === "1" || authorId === 1) {
      return res.status(403).json({
        status: 403,
        errMsg: "You cannot delete this ID."
      });
    }

    // await prisma.author.delete({ where: { id: authorId } });
    

    res.json({ message: `deleting author with ID: ${authorId}`});
  } catch (err) {
    console.error('deleting error...', err);
  }
}



module.exports = {
  authorAll,
  authorById,
  // 
  authorEdit,
  authorDelete,
};