var express = require('express');
var router = express.Router();
const pool = require("../config/database");
const {
    isComapnyInfoExist,
    getProfile,
    updateProfile,
    updatePassword,
    getPassword
} = require("../functions/userAccount");

router.get('/', function (req, res, next) {
    // /account
    var {email, name} = req.user[0];
    isComapnyInfoExist(email).then(r => {
        console.log('comp reg', r.rows[0].company_reg)
        if (!r.rows[0].company_reg) {
            // redirect to company info
            res.redirect('account/company');
        } else {
            res.render('account/index', {userName: req.user[0].name, userEmail: req.user[0].email});
        }
    });
});

router.get('/profile', function (req, res, next) {
    // /account/profile page of user
    getProfile(req, res, next).then(r => console.log('r is :', r));
    // res.render('account/profile', {email: req.user[0].email, username: req.user[0].name, address: '', phone: ''});
});

router.post('/profile', function (req, res, next) {
    // /account/profile page of user
    updateProfile(req, res, next).then(r => console.log('update r is', r))
    // res.render('account/profile');
});

router.get('/update', function (req, res, next) {
    // /account/update page of user
    getPassword(req, res, next).then(r => console.log('r update '));
    // res.render('account/update');
});

router.post('/update', function (req, res, next) {
    // /account/update page of user
    updatePassword(req, res, next).then(r => console.log('r is ', r));
    // res.render('account/update');
});

router.get('/company', function (req, res, next) {
    // /account/company page of user
    var {email, name} = req.user[0];
    isComapnyInfoExist(email).then( async function(r) {
        console.log('comp reg', r.rows[0].company_reg)
        if (!r.rows[0].company_reg) {
            // load info
            try {
                await pool.query('select * from "company_user" where c_user=($1)',[email], (err, result) => {
                    if (!err) {
                        var row = result.rows[0];
                        console.log('row', row)
                        if (row) {
                            console.log(row);
                            res.render('account/company', {cEmail: row.c_email, cName: row.c_name, cAddress: row.c_address, cPhone: row.c_phone});
                        }
                    } else {
                        console.log(' err ', err)
                        res.render('account/company', {cEmail: '', cName: '', cAddress: '', cPhone: ''});
                    }
                })
            } catch (e) {
                console.log('error at /account/company get')
            }
        }
        else {
            try {
                await pool.query('select * from "user_company" where c_user=($1)',[email], (err, result) => {
                    if (!err) {
                        var {c_name, c_email, c_address, c_phone, c_user} = result.rows[0]
                        res.render('account/company', {cName: c_name, cEmail: c_email, cAddress: c_address, cPhone: c_phone});
                    } else { console.log(err) }
                });
            } catch (e) {
                console.log('error at /account/company get company_user');
            }
        }
    });
    // res.render('account/company', {cEmail: '', cName: '', cAddress: '', cPhone: ''});
});

router.post('/company',  async function register(req, res) {
    // /account/company page of user

    var useremail = req.user[0].email;
    var cName = req.body.cName;
    var cEmail = req.body.cEmail;
    var cAddress = req.body.cAddress;
    var cPhone = req.body.cPhone;
    try{
        await pool.query('BEGIN')
        await JSON.stringify(pool.query('SELECT * FROM "user_company" WHERE "c_email"=($1) and c_user=($2)', [cEmail, useremail], function(err, result) {
            if (err) {
                console.log('comp info', err)
            } else {
                if (result.rows[0]) {
                    req.flash('warning', "This email address is already registered. <a href='/login'>Log in!</a>");
                    console.log('already registered', cEmail);
                    res.redirect('/account');
                } else {
                    pool.query('INSERT INTO "user_company" VALUES ($1, $2, $3, $4, $5)', [cName, cEmail, cAddress, cPhone, useremail], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            pool.query('COMMIT')
                            console.log(result)
                            pool.query('update "user" set company_reg = true where email=($1);', [useremail], function (err, result) {
                                if (!err) {
                                    console.log(result)
                                } else {
                                    console.log(err);
                                }
                            });
                            // req.flash('success', 'User created.')
                            // res.redirect('/account');
                        }
                    });
                    req.flash('success', 'Business profile created.')
                    res.redirect('/account');
                }
            }
        }));
    }
    catch(e) {
        console.log('error at /account/company', e)
        res.render('account/company', {cEmail: req.body.cEmail, cName: req.body.cName, cAddress: req.body.cAddress, cPhone: req.body.cPhone});
    }
});

module.exports = router;
