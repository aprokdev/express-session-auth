const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./database');
const { validatePassword } = require('../src/utils');

prisma.$connect();
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, cb) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            console.log(user);
            if (!user) {
                return cb(null, false, { message: 'There is no user with provided email' });
            }
            const isValid = validatePassword(password, user.hash, user.salt);
            if (isValid) {
                return cb(null, user);
            } else {
                return cb(null, false);
            }
        } catch (error) {
            return cb(err);
        }
    })
);

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        cb(null, user);
    } catch (error) {
        return cb(error);
    }
});
