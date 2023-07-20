const express = require('express');
const cookieParser = require('cookie-parser');   
const app = express();
const port = 6500;

//require express ejs layout
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(sassMiddleware({
    src : './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}))

app.use(express.urlencoded());
 app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname+ '/uploads'));

app.use(expressLayouts);
//extract style and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the ejs view engine
app.set('view engine','ejs');
app.set('views', './views');
// mongo store is used to store the session cookie in the db
app.use(session({
        name: 'codeial',
        secret: 'somethings',
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