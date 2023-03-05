const router = require('express').Router();
const prisma = require('../../config/database');
const passport = require('passport');

const header = `
    <header style="display: flex">
        <a href="/register" style="margin: 0 12px;">register</a>
        <a href="/login" style="margin: 0 12px;">login</a>
        <a href="/protected-route" style="margin: 0 12px;">protected-route</a>
    </header>
`;

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/protected-route',
        failureRedirect: '/login',
    })
);

router.post('/register', async (req, res, next) => {
    const { email, first_name, last_name, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                email,
                first_name,
                last_name,
                password,
            },
        });
        if (user) {
            res.redirect(`/login?email=${email}&password=${password}`);
        }
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get('/', (req, res, next) => {
    res.send(
        `${header}
        <h1>Home</h1>
        <p>Please:<br> 
        <a href="/register">register</a><br> 
        <a href="/login">login</a><br> 
        <a href="/protected-route">protected-route</a><br> 
        </p>`
    );
});

router.get('/login', (req, res, next) => {
    const { email, password } = req.query;
    const form = `
        ${header}
        <h1>Login Page</h1>
        <form method="POST" action="/login">\
            Enter Email:<br>
            <input type="email" name="username" value="${email || ''}">\<br>
            Enter Password:<br>
            <input type="password" name="password" value="${password || ''}">\<br><br>
            <button type="submit">Submit</button>
        </form>`;

    res.send(form);
});

router.get('/register', (req, res, next) => {
    const form = `${header}<h1>Register Page</h1>
        <form method="post" action="register">\<br>
            Enter Email:<br>
            <input type="email" name="email">\<br>
            Enter FirstName:<br>
            <input type="text" name="first_name">\<br>
            Enter LastName:<br>
            <input type="text" name="last_name">\<br>
            Enter Password:<br>
            <input type="password" name="password">\<br><br>
            <button type="submit">Submit</button>
        </form>`;

    res.send(form);
});

router.get('/protected-route', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.
    if (req.isAuthenticated()) {
        res.send(
            header + '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
        );
    } else {
        res.send(header + '<h1>You are NOT authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(null, (err) => err);
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send(
        '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
    );
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;
