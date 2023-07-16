const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {

   try {
    let post =  await Post.create({
         content: req.body.content,
         user: req.user._id
      })
      if (req.xhr){
         return res.status(200).json({
            data : {
               post: post
            },
            message: "Post Created!"
         })
      }
      
      return res.redirect('back');
      
   } catch (err) {
      req.flash('error',err);
      return res.redirect('back');
   }
   
}

module.exports.destroy = function (req, res) {
   Post.findById(req.params.id).then((post) => {
         if (post.user == req.user.id) {
            //console.log("matched");
            post.deleteOne().then(()=>{}).catch((err)=>{console.log(err);})
            Comment.deleteMany({ post: req.params.id })
               .then(() => {
                  if(req.xhr){
                     return res.status(200).json({
                        data: {
                           post_id:  req.params.id
                        },
                        message: "Post Deleted!"
                     })
                  }
                  return res.redirect('back');
               })
               .catch((err) => {
                  console.log(err);
               })
         }else{
            return res.redirect('back');
         }
      })
      .catch((err) => {
         console.log(err);
      })
}