// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Access DB thru Prisma
const prisma = require("./database");

// Hash password
// const bcrypt = require("bcryptjs");



// Passport's strategy - json web token
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_SESSION;

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    console.log('from JStrats: ',jwt_payload);
    // Verify if user exists in DB
    const user = await prisma.author.findUnique({
      where: { email: jwt_payload.user.email }
    });

    if (!user) {
      return done(null, false);
    }    
    // console.log();

    return done(null, true);
  } catch (err) {
    return done(err);
  }
});



// Function to tell which field names to look for
// const customFields = {
//   usernameField: 'email',
// }

// passport.use(
//   new LocalStrategy(customFields, async (username, password, done) => {
//     try {
//       const user = await prisma.author.findUnique(username);

//       if (!user) {
//         return done(null, false, { message: "Incorrect username" });
//       }

//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return done(null, false, { message: "Incorrect password" });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.author.findUnique(id);

//     done(null, user);
//   } catch (err) {
//     console.error(err);
//     done(err);
//   }
// });



module.exports = {
  jwtStrategy,
};