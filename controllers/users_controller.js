const User = require('../models/user');
const fs = require('fs');
const path = require('path');



module.exports.profile = function(req, res){
    User.findById(req.params.id).then((user)=>{
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        })
    }).catch((err)=>{
        console.log(err);
    })
    
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body).then(()=>{
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     }).catch((err)=>{
    //         console.log(err);
    //     })
    // }else{
    //   return res.status(401).send('Unauthorised');
    // }
    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err){console.log('****multer err',err)}

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if( user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                    }
                    //this is saving the path of the uploaded file the avatar in the user.
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            })
        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');  
        }

    }else{
        req.flash('error', 'Unauthorised');
        return res.status(401).send('Unauthorised');
    }

}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return  res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

   let user = await User.findOne({email: req.body.email});
   if (!user){
   let createUser = await User.create(req.body);
   //console.log(createUser);
   if(createUser){
    return res.redirect('/users/sign-in');
   }else{
        return res.redirect('back');
    }
   }

}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // TODO later
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have Logged Out!');
        return res.redirect('/');
      });
    // return res.redirect('/');
}