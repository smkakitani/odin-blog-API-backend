// Json Web Token strategy
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Access DB thru Prisma
const prisma = require("./database");



// jwt config
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_SESSION;

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
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
    // console.log('Passport strategy: ', jwt_payload);

    if (!user) {
      return done(null, false);
      // return res.status(400).redirect("/log-in");
    }    
    
    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err);
  }
});



module.exports = {
  jwtStrategy,
};