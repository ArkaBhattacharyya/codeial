const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'somethings',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'arkabhattacharyya.brc@gmail.com',
            pass: 'njnkbnqfneiyhjfy'
        }
    },
    google_client_id: '228096796711-3fpi0q28eaiae88pdon9e73rrj8fk9vo.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: "http://localhost:6500/users/auth/google/callback",
    jwt_secret: 'codiel',
    morgan: {
        mode : 'dev',
        options: {stream:accessLogStream}
    }

}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode : 'combined',
        options: {stream:accessLogStream}
    } 
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT)== undefined ? development: eval(process.env.CODEIAL_ENVIRONMENT);