var pool = require('../config/database')
var bcrypt = require('bcrypt');


module.exports.isComapnyInfoExist = async function isComapnyInfoExist(email) {
    return await pool.query('select company_reg from "user" where email=($1)', [email])
}

module.exports.getProfile = async function getProfile(req, res, next) {
    try {
        await pool.query('select * from "user" where email=($1)',[req.user[0].email], (err, result) => {
            if (!err) {
                console.log('result', result.rows[0]);
                res.render('account/profile', {email: result.rows[0].email, username: result.rows[0].name, address: result.rows[0].address, phone: result.rows[0].phone});
            } else {
                console.log('err', err);
                res.render('account/profile', {email: req.user[0].email, username: req.user[0].name, address: '', phone: ''});
            }
        });
    } catch (e) {
        console.log('Error in getProfile')
    }
};

module.exports.updateProfile = async function updateProfile(req, res, next) {
    try {
        await pool.query('update "user" set address=($1), phone=($2) where email=($3)', [req.body.address, req.body.phone, req.body.email], function(err, result) {
            if(err){console.log(err);}
            else {
                console.log(result)
                req.flash('success','User profile updated.')
                res.redirect('/account/profile')
            }
        });
    } catch (e) {
        console.log('err at updateProfile ', e);
    }
}

module.exports.getPassword = async function getPassword(req, res, next) {
    try {
        await pool.query('select name, email from "user" where email=($1)', [req.user[0].email], function(err, result) {
            if(err){
                console.log(err);
                res.render('account/update', {username: '', email: '', password: ''})
            }
            else {
                console.log(result.rows[0])
                req.flash('success','found user password.')
                res.render('account/update', {username: result.rows[0].name, email: result.rows[0].email, password: ''})
            }
        });
    } catch (e) {
        console.log('err at getPassword ', e);
    }
}

module.exports.updatePassword = async function updatePassword(req, res, next) {
    try {
        var newPass = await bcrypt.hash(req.body.password, 5);
        await pool.query('update "user" set password=($1) where email=($2)', [newPass, req.body.email], function(err, result) {
            if(err){console.log(err);}
            else {
                console.log(result)
                req.flash('success','User password updated.')
                res.redirect('/account/update')
            }
        });
    } catch (e) {
        console.log('err at updatePassword ', e);
    }
}
