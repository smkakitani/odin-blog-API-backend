// Passportjs
const passport = require("passport");
// Json Web Token strategy
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// Access DB thru Prisma
const prisma = require("./database");



// jwt config
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_SESSION;
opts.passReqToCallback = true;

// Strategy runs if token extraction succeed
const jwtStrategy = new JwtStrategy(opts, async (req, jwt_payload, done) => {
  try {
    const findVisitor = await prisma.visitor.findFirst({
      where: { 
        OR: [
          {
            email: jwt_payload.user.email,
          }, {
            username: jwt_payload.user.username,
          },
        ]
      },
      select: { 
        email: true,
        id: true,
        username: true,
      }
    });
    const findAuthor = await prisma.author.findUnique({
      where: { email: jwt_payload.user.email },
      select: { 
        email: true, 
        id: true 
      }
    });
    const user = findVisitor || findAuthor;

    if (!user) {
      return done(null, false);
    }
    // Append user to request
    req.user = user;
    
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtStrategy);

// Callback to send token's error
function auth(req, res, next) {
  return passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    // console.log("error: ", err, "|info: ", info, "|user?", user);

    if (err) return next(err);
    
    if (!user) {
      // Foward information about JWT error
      return res.status(401).json({
        status: 401,
        message: info,
      });
    }

    next();
  })(req, res, next)
}



module.exports = {
  jwtStrategy,
  auth,
};