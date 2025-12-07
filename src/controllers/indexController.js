// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
// Validator
const { validateSignUpAuthor, validateSignUpVisitor, validateLogIn, validationResult, matchedData } = require("../utils/validation");
// Hash password
const bcrypt = require("bcryptjs");
// Auth
const passport = require("passport");
const { jwtStrategy } = require("../config/passport");
const jwt = require("jsonwebtoken");

// Set Passport's strategy to JWT
passport.use(jwtStrategy);



// 
const authorSignUp = [
  validateSignUpAuthor,
  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    next();
  }, async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, bio } = matchedData(req);
      const hashPassword = await bcrypt.hash(password, 9);

      const author = await prisma.author.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashPassword,
          bio,
        },
        omit: {
          password: true,
        }
      });

      res.status(201).json({
        status: 201,
        message: "Author has been created.",
        author,
      });
    } catch (err) {
      next(err);
    }
  }
];

const visitorSignUp = [
  validateSignUpVisitor,
  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid.",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    next();
  }, async (req, res, next) => {
    try {
      const { username, email, password } = matchedData(req);
      const hashPassword = await bcrypt.hash(password, 9);

      const user = await prisma.visitor.create({
        data: {
          username,
          email,
          password: hashPassword,
        },
        omit: {
          password: true,
        }
      });

      res.status(201).json({
        status: 201,
        message: "User has been created.",
        user,
      });
    } catch (err) {
      next(err);
    }    
  }
];

const logIn = [
  validateLogIn,
  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errMsg: "Invalid.",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    next();
  }, async (req, res, next) => {
    try {
      const { email, password } = matchedData(req);
      
      const findVisitor = await prisma.visitor.findUnique({
        where: { email: email },
        select: {
          username: true,
          email: true,
          id: true,
          password: true,
        },
      });
      const findAuthor = await prisma.author.findUnique({
        where: { email: email },
        select: {
          email: true,
          id: true,
          password: true,
        },
      });
      
      const user = findVisitor || findAuthor;

      if (!user) {
        // User returns null
        return res.status(400).json({ status: 400, errMsg: "Invalid credentials." });
      }

      const matchUser = await bcrypt.compare(password, user.password);
      if (!matchUser) {
        return res.status(400).json({ status: 400, errMsg: "Invalid credentials."});
      }

      // Send only necessary information about user to store on token
      delete user.password;

      // Should change expiration token to 7 days
      const token = jwt.sign({user}, process.env.SECRET_SESSION, { expiresIn: "1H" });

      res.status(200).json({ 
        status: 200,
        message: "Authentication succeeded",
        user: user,
        token
      });
    } catch (err) {
      next(err);
    }    
  }
];

async function logOut(req, res, next) {
  // When the user logs out, you can have the client remove the JWT from storage.
  res.send("logging out... ;-;");
}



module.exports = {
  authorSignUp,
  visitorSignUp,
  logIn,
  logOut,
};