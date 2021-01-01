const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require("./database");

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, username, password, done) => {

    var email = username
    loginAttempt().finally(() => {
        console.log('Checking for', email)
    });

    async function loginAttempt() {
        const client = await pool.connect().catch(e => { console.log('connect error: ', e)});
        try {
            await client.query('BEGIN')
            await JSON.stringify(client.query('SELECT "name", "email", "password" FROM "user" WHERE "email"=$1', [email], function (err, result) {

                if (err) {
                    console.log('query err', err);
                    return done(err)
                }
                if (result.rows[0] == null) {
                    req.flash('danger', "Oops. Incorrect login details.");
                    return done(null, false);
                } else {
                    bcrypt.compare(password, result.rows[0].password, function (err, check) {
                        if (err) {
                            console.log('Error while checking password');
                            return done();
                        } else if (check) {
                            return done(null, [{email: result.rows[0].email, name: result.rows[0].name}]);
                        } else {
                            req.flash('danger', "Oops. Incorrect login details.");
                            return done(null, false);
                        }
                    });
                }
            }));
        } catch (e) {
            throw (e);
        }
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
