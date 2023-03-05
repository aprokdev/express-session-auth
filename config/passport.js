const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./database');

prisma.$connect();
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: username,
                },
            });
            if (!user) {
                return cb(null, false, { message: 'Incorrect username' });
            }
            return cb(null, user);
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
