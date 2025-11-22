const { body, validationResult, matchedData } = require("express-validator");
const prisma = require("../config/database");



// Author validation
const alphaErr = "must only contain letters or '-'.";
const lengthErr = "must be between 2 and 32 characters.";
// bail() exemple
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
  const existingAuthor = await prisma.author.findUnique({ 
    where: { email: value } 
  });
  // Look for email on Visitor table
  const existingVisitor = await prisma.visitor.findFirst({
    where: { email: value }
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
  ,body("bio").trim().optional({ values: "falsy" })
    // .escape()
  // ,query("")
];



module.exports = {
  validateAuthor,
  validationResult,
  matchedData,
};