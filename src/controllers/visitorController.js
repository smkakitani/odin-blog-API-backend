// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");

const { validateVisitor, validationResult, matchedData } = require("../utils/validation");



// 
async function visitorAll(req, res) {
  try {
    const allVisitors = await prisma.visitor.findMany();

    res.json(allVisitors);
  } catch (err) {
    console.error(err);
  }  
}

async function visitorById(req, res) {
  try {
    const username = req.params.username;
    
    const visitor = await prisma.visitor.findUnique({
      where: { username: username }
    });

    res.json(visitor);
  } catch (err) {
    console.error(err);
  }
}

const visitorEdit = [
  validateVisitor,
  async (req, res, next) => {    
    const user = req.user;

    const visitor = await prisma.visitor.findUnique({
      where: { email: user.email }
    });

    if (!visitor) {
      console.log("User inexistent: ", visitor);
      return res.status(400).json({
        status: 404,
        errMsg: "User not found.",
      });
    }

    next();    
  }, async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        status: 400,
        errMsg: "",
        err: errors.array({ onlyFirstError: true }),
      });
    }
    // 
    const { email, password } = matchedData(req);
    const hashPassword = await bcrypt.hash(password, 9);

    const user = await prisma.visitor.update({
      where: { email: req.user.email },
      data: { email, password: hashPassword }
    });

    res.json(user);
  }
];

const visitorDelete = [
  async (req, res, next) => {
    // Search for username
    try {
      const { username } = req.params;

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
      console.error(err);
    }
  }, async (req, res, next) => {
    try {
      const { username } = req.params;

      const delComments = await prisma.comment.deleteMany({
        where: {
          username: username,
        }
      });

      const delUser = await prisma.visitor.delete({
        where: {
          username: username,
        }
      });

      const transaction = await prisma.$transaction([delComments, delUser]);

      res.json({ msg: `User ${username} and their comments deleted.`});
    } catch (err) {
      console.error(err);
    }
  }
];



module.exports = {
  visitorAll,
  visitorById,
  visitorEdit,
  visitorDelete,
};