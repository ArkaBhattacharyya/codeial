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
    }, 
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }    
    ]
},{
    timestamps: true
});

const Comment = mongoose.model('Comment',CommetSchema);

module.exports = Comment;