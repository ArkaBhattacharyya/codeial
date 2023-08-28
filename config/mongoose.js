const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb://localhost:27017/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console," Error connection to mongodb"));

db.once('open', function(){
    console.log("connected to Database :: Mongodb");
});

module.exports = db;