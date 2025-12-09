const { body, param, validationResult, matchedData } = require("express-validator");
const prisma = require("../config/database");



// Author validation
const alphaErr = "must only contain letters or '-'.";
const lengthErr = "must be between 2 and 32 characters.";



// Custom validators
const emailExist = async (value) => {
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
  
  // Prisma's findMany() returns empty array if no matching records found
  if (existingAuthor.length !== 0 || existingVisitor.length !== 0) {
    throw new Error;
  }
}

const changeEmail = async (value, { req }) => {  
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

  // User is visitor
  if (req.user.username) {
    if (req.user.email === value) {
      console.log(value);
      return;
    }
  } 
  // User is author
  if (req.user) {
    if (req.user.email === value) {
      return;
    }
  }

  // Prisma's findMany() returns empty array if no matching records found
  if (existingAuthor.length !== 0 || existingVisitor.length !== 0) {
    throw new Error;
  }
}

const samePassword = async (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error;    
  }
};

const sameUsername = async (value, { req }) => {
  // Username is case insensitive
  const existingUsername = await prisma.visitor.findMany({
    where: { 
      username: {
        equals: value,
        mode: "insensitive"
      },      
    },
  });

  // Prisma's findMany() returns empty array if no matching records found
  if (existingUsername.length !== 0) {
    throw new Error("Username already being used.");
  }
}



// Chain validators
const validateSignUpAuthor = [
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
    .hide("***"),
  body("bio").trim().optional({ values: "falsy" }).escape(),
];

const validateSignUpVisitor = [
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

const validateLogIn = [
  body("email").trim()
    .notEmpty().withMessage("Missing e-mail field.")
    .isEmail().withMessage("Not a valid e-mail address."),
  body("password")
    .notEmpty().withMessage("Missing password.")
];

const validateUpdateVisitor = [
  body("email").trim().optional({ values: "falsy" })
    .notEmpty().withMessage("Missing e-mail field.")
    .isEmail().withMessage("Not a valid e-mail address.")
    .custom(changeEmail).withMessage("E-mail already in use.")
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

const validateUpdateAuthor = [
  param("authorId")
    .isInt().withMessage("authorId is not an Integer.")
    .toInt(),
  body("firstName").trim().optional({ values: "falsy" })
    .notEmpty().withMessage("Missing first name.")
    .isAlpha(["pt-BR"], { ignore: " -." }).withMessage(`First name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim().optional({ values: "falsy" })
    .notEmpty().withMessage("Missing last name.")
    .isAlpha(["pt-BR"], { ignore: " -." }).withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 2, max: 32 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim().optional({ values: "falsy" })
    .notEmpty().withMessage("Missing e-mail field.")
    .isEmail().withMessage("Not a valid e-mail address.")
    .custom(changeEmail).withMessage("E-mail already in use.")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Missing password.")
    .isLength({ min: 6 }).withMessage("Password must contain at least 6 characters.")
    .hide("***"),
  body("confirmPassword")
    .notEmpty().withMessage("Missing password.")
    .custom(samePassword).withMessage("Must be same as password field.")
    .hide("***"),
  body("bio").trim().optional({ values: "falsy" }),
  
];

// From TinyMCE
const validatePost = [  
  body("title").trim()
    .notEmpty().withMessage("Missing title field"),
  body("content").trim()
    .notEmpty().withMessage("Missing content."),
  body("published").optional({ values: "falsy" })
];

const validateComment = [
  body("content").trim()
    .notEmpty().withMessage("Missing comment.")
];

const validateAuthorParams = [
  param("authorId")
    .isInt().withMessage("Author's ID must be an Integer.")
    .toInt()
];

const validatePostParams = [
  param("postId")
    .isInt().withMessage("Post's ID must be an Integer.")
    .toInt()
];

const validateCommParams = [
  param("commentId")
    .isULID().withMessage("Comment ID is not ULID.")
];



module.exports = {
  validateSignUpAuthor,
  validateSignUpVisitor,
  validateLogIn,
  // 
  validateUpdateVisitor,
  validateUpdateAuthor,
  // 
  validateComment,
  validatePost,
  // 
  validateAuthorParams,
  validatePostParams,
  validateCommParams,
  // 
  validationResult,
  matchedData,
};