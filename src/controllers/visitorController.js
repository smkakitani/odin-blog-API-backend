// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
// Validation
const { validateUpdateVisitor, validationResult, matchedData } = require("../utils/validation");
// Hash passwords
const bcrypt = require("bcryptjs");



// 
async function visitorAll(req, res, next) {
  try {
    const allVisitors = await prisma.visitor.findMany({
      omit: {
        password: true,
      },
      include: {
        _count: {
          select: { comments: true },
        }
      }
    });

    res.json(allVisitors);
  } catch (err) {
    next(err);
  }  
}

async function visitorById(req, res, next) {
  try {
    const username = req.params.username;
    
    const visitor = await prisma.visitor.findUnique({
      where: { username: username },
      omit: {
        password: true,
      },
      include: {
        comments: true,
      }
    });

    if (!visitor) {
      return res.status(404).json({
        status: 404,
        errMsg: "User not found.",
      });
    }

    res.json(visitor);
  } catch (err) {
    next(err);
  }
}

const visitorEdit = [
  validateUpdateVisitor,
  async (req, res, next) => {
    // Check if user exists (and if token = req.params?)
    const user = req.user;
    const { username } = req.params;

    const visitor = await prisma.visitor.findUnique({
      where: { email: user.email }
    });

    if (!visitor) {
      return res.status(400).json({
        status: 404,
        errMsg: "User not found.",
      });
    }

    if (visitor.username !== username) {
      return res.status(409).json({
        status: 409,
        errMsg: "Conflict. Different users."
      });
    }

    next();    
  }, async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid.",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    const { email, password } = matchedData(req);
    const hashPassword = await bcrypt.hash(password, 9);

    const user = await prisma.visitor.update({
      where: { email: req.user.email },
      data: { email, password: hashPassword },
      omit: {
        password: true,
      }
    });

    res.json(user);
  }
];

const visitorDelete = [
  async (req, res, next) => {
    try {
      // Check if user from params is same as user from token
      const { username } = req.params;
      const user = req.user;

      if (username !== user.username) {
        return res.status(403).json({
          status: 403,
          errMsg: "Different users."
        });
      }

      const isUser = await prisma.visitor.findMany({
        where: {
          username: {
            equals: username,
            mode: "insensitive"
          }
        }
      });

      if (isUser.length === 0) {
        return res.status(400).json({
          status: 400,
          errMsg: `Username ${username} not found`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  }, async (req, res, next) => {
    try {
      const { username } = req.params;
      const user = req.user;

      // Using Prima's transaction to ensure queries succeed or not together - don't use AWAIT
      const delComments = prisma.comment.deleteMany({
        where: {
          usernameId: (username === user.username) ? user.id : null,
        }
      });
      const delUser = prisma.visitor.delete({
        where: {
          id: (username === user.username) ? user.id : null,
        },
        omit: {
          password: true,
        }
      });

      const transaction = await prisma.$transaction([delComments, delUser]);

      res.status(204).json({ 
        status: 204,
        message: `User ${user.username} and their comments deleted.`,
        transaction,
      });
    } catch (err) {
      next(err);
    }
  }
];



module.exports = {
  visitorAll,
  visitorById,
  visitorEdit,
  visitorDelete,
};