const express = require('express');
const dotenv =require('dotenv')
dotenv.config();
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser = require('cookie-parser');   
const app = express();
require('./config/view-helper')(app);
const port = process.env.PORT || 6500;
//require express ejs layout
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000,function(error){
    if(error){
     console.log("socket error here");
     return;
    }
    console.log("chat server listing on port 5000");
 });

 const path = require('path');
if(env.name == 'development'){
    app.use(sassMiddleware({
        src : path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'expanded',
        prefix: '/css'
    }))
}

app.use(express.urlencoded());
 app.use(cookieParser());

app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname+ '/uploads'));

app.use(expressLayouts);

app.use(logger(env.morgan.mode, env.morgan.options));

//extract style and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the ejs view engine
app.set('view engine','ejs');
app.set('views', './views');
// mongo store is used to store the session cookie in the db
app.use(session({
        name: 'codeial',
        secret: env.session_cookie_key,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 40 * 100)
        },
        store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/codeial_development' })
       
        
}));

app.use(passport.initialize());
app.use(passport.session());
//set flash after session
app.use(flash());
app.use(customMiddleware.setFlash);


app.use(passport.setAuthenticatedUser);
//user express router
app.use('/',require('./routes'));
app.listen(port, function(err){
  
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on prot: ${port}`)
})