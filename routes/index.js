var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const passport = require("../config/passport");
const pool = require('../config/database');

router.get('/', function (req, res, next) {
  // home page of app
  if (req.isAuthenticated()) {
    res.redirect('/account'); // redirect to /account if user already logged in.
  } else {
    res.render('index'); // {title: "Log in", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
  }
  // res.render('index', {title: 'Express', data: 'no data'});
});

router.get('/login', function (req, res, next) {
  // login
  if (req.isAuthenticated()) {
    res.redirect('/account');
  } else {
    res.render('login', {title: "Log in", email: '', password: '', expressFlash: req.flash('danger')});  // , userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
  }
  // res.render('index', {title: 'Express', data: 'no data'});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/account',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res) {
  console.log('login reached');
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }
  res.redirect('/');
});

router.get('/logout', function(req, res){
  // logout
  console.log('[before logout] Authorized: ', req.isAuthenticated());
  req.logout();
  console.log('[after logout] Authorized: ', req.isAuthenticated());
  req.flash('success', "Logged out. See you soon!");
  res.redirect('/login');
});

router.get('/register', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/account');
  } else {
    res.render('register', {title: "Register", name: '', email: '', password: '', confpassword: ''});  // , userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
  }
});

router.post('/register', async function register(req, res) {
  try{
    await pool.query('BEGIN')
    var pwd = await bcrypt.hash(req.body.password, 5);
    await JSON.stringify(pool.query('SELECT * FROM "user" WHERE "email"=$1', [req.body.email], function(err, result) {
      if(result.rows[0]){
        req.flash('warning', "This email address is already registered.");
        console.log('already registered', req.body.email);
        res.redirect('/login');
      }
      else{
        pool.query('INSERT INTO "user" VALUES ($1, $2, $3)', [req.body.name, req.body.email, pwd], function(err, result) {
          if(err){console.log(err);}
          else {
            pool.query('COMMIT')
            console.log(result)
            req.flash('success','User created.')
            res.redirect('/login');
          }
        });
      }
    }));
  }
  catch(e){console.log('error at /register', e)}
});

module.exports = router;
