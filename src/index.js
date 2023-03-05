const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const prisma = require('../config/database');
const routes = require('./routes');

// to have ability to get .env variables
require('dotenv').config();

const app = express();

// connect db via Prisma ORM:
prisma.$connect();

// connect passport config:
require('../config/passport');

// couple basic middlewares to simplify work with data:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bind session with MySQL database
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '9001',
    database: 'express-auth',
});
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
        key: 'session_id',
    })
);

// initializing passport with passport session:
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(8000, () => console.log('Server started at port: 8000'));
