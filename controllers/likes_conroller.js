const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.toggleLike = async (req,res)=>{
    try {
        //likes/toggle/?id=abcd&type=Post/Comment
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        // if a like already exists then deleted it 
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user.id,
                likeable: req.query.id,
                onModel:  req.query.type
            });
            likeable.likes.push(like);
            likeable.save();
        }
        return res.json(200,{
          message: "Request Successfull",
          data : {
            deleted : deleted
          }
        })

    } catch (error) {
         console.log("Error is", error);
         return res.json(500,{
            message: "Internal Server Error"
         });
    }
}