const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.objectID
    },
    likeable: {
        type: mongoose.Schema.objectID,
        require: true,
        refPath: 'onMadel'
    },
    onModel: {
        type: String,
        require: true,
        enum: ['Post','Comment']
    }

},{
    timestamps: true
}

);

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;
  