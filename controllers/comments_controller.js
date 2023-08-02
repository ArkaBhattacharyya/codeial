const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/keu');
const commentEmailsWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            console.log(comment);
            comment = await comment.populate('user', 'name email');
            //commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('Error in sending to the queue',err);
                    return;
                }
                console.log('job enqueued', job.id);    
            })
            // if (req.xhr){
                
    
            //     return res.status(200).json({
            //         data: {
            //             comment: comment
            //         },
            //         message: "Post created!"
            //     });
            // }
           

            res.redirect('/');
        }
    }catch(err){
        console.error(err);
        req.flash('error', 'Something went wrong!');
        return;
    }
    
}

module.exports.destroy = function(req, res){
     Comment.findById(req.params.id).then((comment)=>{
       if( comment.user == req.user.id){
        let postId = comment.post;
        comment.deleteOne().then(()=>{}).catch((err)=>{console.log(err)});
        Post.findByIdAndUpdate(postId, {$pull:{comments: req.params.id}}).then(()=>{ return res.redirect('back'); }).catch((err)=>{console.log(err)});
       }else{
        return res.redirect('back');
       }
     }).catch((err)=>{
        console.log(err);
     })
}