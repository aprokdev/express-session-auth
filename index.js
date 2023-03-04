const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '9001',
    database: 'session_test',
};

var sessionStore = new MySQLStore(options);

app.use(
    session({
        secret: 'session_cookie_secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {},
        key: 'session_cookie_name',
    })
);

app.get('/', (req, res, next) => {
    res.send('<h1>It works!</h1>');
});

app.listen(8000, () => console.log('Server started at port: 8000'));
