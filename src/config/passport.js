const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("./database");

// Hash password
const bcrypt = require("bcryptjs");



// 
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.author.findUnique(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.author.findUnique(id);

    done(null, user);
  } catch (err) {
    console.error(err);
    done(err);
  }
});



module.exports = passport;