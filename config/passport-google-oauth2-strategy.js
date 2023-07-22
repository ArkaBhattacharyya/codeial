const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: '228096796711-3fpi0q28eaiae88pdon9e73rrj8fk9vo.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:6500/users/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec().then((user)=>{
          console.log(profile);
          if(user){
            //if found , set this user as req.user
          return  done(null, user)
        }else{
          //if not found, then create new user and set it as req.user
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex')
          }).then(()=>{
            return done(null, user);
          }).catch((err)=>{
           console.log('error in create google passport strategy',err);return;
          })
        }
        }).catch((err)=>{
          if(err){console.log('err in google passport strategy',err);return;}
            
        })
    }
));

module.exports = passport;