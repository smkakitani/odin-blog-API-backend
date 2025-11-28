const { body, validationResult, matchedData } = require("express-validator");
const prisma = require("../config/database");



// Author validation
const alphaErr = "must only contain letters or '-'.";
const lengthErr = "must be between 2 and 32 characters.";
// bail() example
// body('username')
//   .isEmail()
//   // If not an email, stop here
//   .bail()
//   .custom(checkDenylistDomain)
//   // If domain is not allowed, don't go check if it already exists
//   .bail()
//   .custom(checkEmailExists);


// Custom validators
const emailExist = async (value) => {
  // console.log(value, typeof value);
  // Look for email on Author table
  const existingAuthor = await prisma.author.findMany({ 
    where: { 
      email: {
        equals: value,
        mode: "insensitive"
      } 
    } 
  });
  // Look for email on Visitor table
  const existingVisitor = await prisma.visitor.findMany({
    where: { 
      email: {
        equals: value,
        mode: "insensitive"
      } 
    } 
  });
  // console.log(existingAuthor, existingVisitor);

  if (existingAuthor || existingVisitor) {
    throw new Error("E-mail already being used.");
  }
}
const samePassword = async (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error;    
  }
};
const sameUsername = async (value) => {
  
  // Look for username on Visitor table - case insensitive? hmmm...
  // const existingUsername = await prisma.visitor.findUnique({
  //   where: { username: value, mode: "insensitive" }
  // });
  const existingUsername = await prisma.visitor.findMany({
    where: { 
      username: {
        equals: value,
        mode: "insensitive"
      },      
    },
  });

  // console.log('Verifying username: ', value, existingUsername);
  if (existingUsername) {
    throw new Error("Username already being used.");
  }
}



const validateAuthor = [
  body("firstName").trim()
    .notEmpty().withMessage("Missing first name.")
    .isAlpha(["pt-BR"], { ignore: " -." }).withMessage(`First name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .notEmpty().withMessage("Missing last name.")
    .isAlpha(["pt-BR"], { ignore: " -." }).withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .notEmpty().withMessage("Missing e-mail field.")
    .isEmail().withMessage("Not a valid e-mail address.")
    .custom(emailExist).withMessage("E-mail already in use.")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Missing password.")
    .isLength({ min: 6 }).withMessage("Password must contain at least 6 characters.")
    .hide("***"),
  body("confirmPassword")
    .notEmpty().withMessage("Missing password.")
    .custom(samePassword).withMessage("Must be same as password field.")
    .hide("***")
  ,body("bio").trim().optional({ values: "falsy" })
    // .escape()
  // ,query("")
];

const validateVisitor = [
  body("username").trim()
    .notEmpty().withMessage("Missing username.")
    .isAlphanumeric("en-US", { ignore: "-_"}).withMessage(`Only letters, numbers or '-' '_'.`)
    .isLength({ min: 4, max: 16 }).withMessage("Username must be between 4 and 16 characters.")
    .custom(sameUsername),
  body("email").trim()
    .notEmpty().withMessage("Missing e-mail field.")
    .isEmail().withMessage("Not a valid e-mail address.")
    .custom(emailExist).withMessage("E-mail already in use.")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Missing password.")
    .isLength({ min: 6 }).withMessage("Password must contain at least 6 characters.")
    .hide("***"),
  body("confirmPassword")
    .notEmpty().withMessage("Missing password.")
    .custom(samePassword).withMessage("Must be same as password field.")
    .hide("***"),
];

// const validatePost = [
//   body("title").notEmpty().trim()
//     .
// ];



module.exports = {
  validateAuthor,
  validateVisitor,
  // 
  validationResult,
  matchedData,
};