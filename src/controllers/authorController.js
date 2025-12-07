// Import Prisma's client instantiated in '../config/database'
const { Prisma } = require("../../generated/prisma");
const prisma = require("../config/database");
// Validation
const { validateUpdateAuthor, validateAuthorParams, validationResult, matchedData } = require("../utils/validation");
// Hash password
const bcrypt = require("bcryptjs");



// 
async function authorAll(req, res) {
  const authorAll = await prisma.author.findMany({
    omit: {
      password: true,
    }
  });

  res.json(authorAll);
}

const authorById = [
  validateAuthorParams,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid.",
          err: errors.array(),
        });
      }

      const { authorId } = matchedData(req);

      const author = await prisma.author.findUnique({
        where: { id: authorId },
        omit: { password: true },
      });

      if (!author) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }
      
      res.json(author);
    } catch (err) {
      next(err);
    }  
  }
];

const authorEdit = [
  validateUpdateAuthor,
  async (req, res, next) => {
    // Check parameters
    const errors = validationResult(req);

    // Parameters are validated first
    if (!errors.isEmpty() && errors.mapped()?.authorId) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid parameters.",
        err: errors.array()[0],
      });
    }

    // Body validation
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid request",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    // Check user's token and from request parameters
    const { authorId } = matchedData(req, { locations: ["params"] } );

    if (req.user.id !== authorId) {
      return res.status(400).json({
        status: 400,
        errMsg: "Different users trying to edit author data."
      });
    }

    next();
  }, async (req, res, next) => {
    try {
      // Check if there's user's ID in DB - update throw error if record doesn't exist
      const { authorId } = matchedData(req, { locations: ["params"] } );

      const author = await prisma.author.findUnique({
        where: { id: authorId }
      });

      if (!author) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }      

      next();
    } catch (err) {
      next(err);
    }    
  }, async (req, res, next) => {
    // Validated fields
    const { authorId, firstName, lastName, email, password, bio } = matchedData(req);
    const hashPassword = await bcrypt.hash(password, 9);    

    const author = await prisma.author.update({
      where: { id: authorId },
      data: { 
        firstName: firstName ?? Prisma.skip, 
        lastName: lastName ?? Prisma.skip, 
        email: email ?? Prisma.skip, 
        password: hashPassword, 
        bio,
      },
      omit: { password: true },
    });

    res.json(author);
  }
];

const authorDelete = [
  validateAuthorParams,
  async (req, res, next) => {
    try {
      // Check parameters
      const errors = validationResult(req);

      // Parameters are validated first
      if (!errors.isEmpty() && errors.mapped()?.authorId) {
        return res.status(400).json({
          status: 400,
          errMsg: "Invalid parameters.",
          err: errors.array()[0],
        });
      }

      // Check author's ID
      const { authorId } = matchedData(req, { locations: ["params"] });
      const isAuthor = await prisma.author.findUnique({
        where: { id: authorId },
      });

      if (!isAuthor) {
        return res.status(404).json({
          status: 404,
          errMsg: "Author not found.",
        });
      }

      if (authorId === 1) {
        return res.status(403).json({
          status: 403,
          errMsg: "You cannot delete this ID."
        });
      }

      const deletedAuthor = await prisma.author.delete({
        where: {
          id: authorId,
        },
        select: {
          id: true,
          email: true,
          posts: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      res.json({ 
        status: 200,
        message: `Author ${deletedAuthor.email} and their posts deleted.`,
        deletedAuthor,
      });
    } catch (err) {
      next(err);
    }
  }
];



module.exports = {
  authorAll,
  authorById,
  // 
  authorEdit,
  authorDelete,
};