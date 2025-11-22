// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");
// const {Prisma} = require("../../generated/prisma");
// const { body, query, validationResult, matchedData } = require("express-validator");
const { validateAuthor, validationResult, matchedData } = require("../utils/validation");
const bcrypt = require("bcryptjs");
// 
const passport = require("passport");
const { jwtStrategy } = require("../config/passport");
const jwt = require("jsonwebtoken");

// Set Passport's strategy to JWT
passport.use(jwtStrategy);



// 
const signUp = [
  validateAuthor,
  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        status: 400,
        errMsg: "",
        err: errors.array({ onlyFirstError: true }),
      });
    }

    next();
  }, async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, bio } = matchedData(req);
      const hashPassword = await bcrypt.hash(password, 9);
      console.log({ firstName, lastName, email, password, bio }, 'hashed password: ',hashPassword);

      // await prisma.author.create({
      //   data: {
      //     firstName,
      //     lastName,
      //     email,
      //     password: hashPassword,
      //     bio,
      //   }
      // });

      res.status(201).json({
        status: 201,
        message: "Author has been created."
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
];

const logIn = [
  // Verify e-mail and password
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.author.findUnique({
        where: { email: email }
      });    

      if (!user) {
        // User returns null
        return res.status(400).json({ status: 400, errMsg: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ status: 400, errMsg: "Incorrect password"});
      }

      // 
      const token = jwt.sign({user}, process.env.SECRET_SESSION, { expiresIn: 60 });

      console.log('calling from login: ', user);
      res.status(200).json({ 
        status: 200,
        message: "Authentication succeeded",
        token 
      })
    } catch (err) {
      console.error(err);
    }    
  }
];

async function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.send("logging out... ;-;");
  });
}



module.exports = {
  signUp,
  logIn,
  logOut,
};