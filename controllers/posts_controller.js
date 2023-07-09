const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function (req, res) {
   Post.create({
      content: req.body.content,
      user: req.user._id
   }).then((post) => {
      return res.redirect('back');
   }).catch((err) => {
      console.log('Error is creating a post');
      return;
   })
}

module.exports.destroy = function (req, res) {
   Post.findById(req.params.id).then((post) => {
         if (post.user == req.user.id) {
            //console.log("matched");
            post.deleteOne().then(()=>{}).catch((err)=>{console.log(err);})
            Comment.deleteMany({ post: req.params.id })
               .then(() => {
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