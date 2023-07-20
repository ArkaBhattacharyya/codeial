const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){

  let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user').populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    });

  return res.json(200, {
    message: "List of Posts",
    posts: posts
  })
}

module.exports.destroy = function (req, res) {
  Post.findById(req.params.id).then((post) => {
        // if (post.user == req.user.id) {
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
                 return res.json(200,{
                  message: "Post data and associative comment delete successfully"
                 });
              })
              .catch((err) => {
                 console.log(err);
              })
        // }else{
        //    return res.redirect('back');
        // }
     })
     .catch((err) => {
      return res.json(500,{
        message: "Internal server error"
       });
     })
}