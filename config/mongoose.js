const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/codeial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console," Error connection to mongodb"));

db.once('open', function(){
    console.log("connected to Database :: Mongodb");
});

module.exports = db;