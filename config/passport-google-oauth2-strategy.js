const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

const env = require('./environment');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url,
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