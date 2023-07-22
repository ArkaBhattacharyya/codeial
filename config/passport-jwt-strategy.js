const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codiel'
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id).then((user)=>{
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
      })
      .catch((err)=>{
          console.log( "error in finding user from JWT");
          return done(err);
      }) 
}));

module.exports = passport;