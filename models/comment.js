const mongoose = require('mongoose');

const CommetSchema =  new mongoose.Schema({
    content: {
        type:String,
        required: true
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' 
    } 
},{
    timestamps: true
});

const Comment = mongoose.model('Comment',CommetSchema);

module.exports = Comment;