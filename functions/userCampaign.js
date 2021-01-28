const pool = require("../config/database");

module.exports.getTypes = async function getTypes(req, res, next) {
    try {
        await pool.query('select * from "ad_types"', function(err, result) {
            if(err){console.log(err);}
            else {
                console.log(result.rows) // shows types of ads
                // req.flash('success','User password updated.')
                // res.redirect('/account/update')
                res.render('campaign/create', {cmpTitle: '', cmpDesc: '', cmpType: result.rows});
            }
        });
    } catch (e) {
        console.log('err at getType ', e);
    }
}

module.exports.getList = async function getList(req, res, next) {
    try {
        console.log(req.user[0])
        await pool.query('select * from "ad_content" where adv_user=($1)', [req.user[0].email], function(err, result) {
            if(err){console.log('err', err);}
            else {
                // list of ads
                if (result.rows) {
                    res.render('campaign', {listData: result.rows})
                } else {
                    res.render('campaign', {listData: undefined})
                }
            }
        });
    } catch (e) {
        console.log('err at getList ', e);
    }
}

module.exports.createCampaign = async function createCampaign(req, res, next) {
    try {
        var adv_id = 'ADVU' + Math.floor(new Date().getTime() / 1000) % 100000;
        var ad_user = req.user[0].email;
        var title = req.body.cmpTitle;
        var desc = req.body.cmpDesc;
        var adv_type = req.body.cmpType;
        await pool.query('insert into ad_content values ($1, $2, $3, $4, $5)',[adv_id, ad_user, title, desc, adv_type], (err, result) => {
            if (!err) {
                try {
                    // insert to ads
                    pool.query('insert into ads (ad_type, ad_company, ad_user, ad_location) values ($1, (select c_email from user_company where user_company.c_user=($2) limit 1), $2, $3)', [adv_type, ad_user, 'national'], (err, result) => {
                        if (!err) {
                            console.log('[Added] ad:', result.rowCount, 'row inserted');

                            // set order amount
                            let order_amount = 5000;
                            if (adv_type === 'WEB') {
                                order_amount = 10500;
                            } else if (adv_type === 'APP') {
                                order_amount = 12000;
                            } else if (adv_type === 'PRINT') {
                                order_amount = 8500;
                            }

                            let order_id = (Date.now() >> 2) % 450000;
                            let order_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            // insert to orders
                            pool.query('insert into orders values ($1, $2, (select ad_id from ads where ad_user=($7) order by ad_id desc limit 1), $3, $4, $5, $6)', [order_id, req.user[0].email, adv_type, order_time, order_amount, 'pending', req.user[0]], (err, result) => {
                                if (!err) {
                                    console.log('[Added] order:', result.rowCount, 'row inserted');
                                } else {
                                    console.log('Unable to add "order"', err)
                                }
                            });
                        } else {
                            console.log('Unable to add "ad" for ', err)
                        }
                    });
                } catch (e) {
                    console.log('error at insert ads :', e)
                }
                req.user.push({adv_id: adv_id});
                console.log(req.user, adv_id)
                console.log('create camp ',result.rows)
                res.redirect('/campaign');
            } else {
                console.log('err', err);
                res.redirect('/campaign');
            }
        });
    } catch (e) {
        console.log('error at createCampaign', e)
    }
};

module.exports.viewDeleteInfo = async function viewDeleteInfo(req, res, next) {
    try {
        await pool.query('select * from ad_content where adv_user=($1)',[req.user[0].email], (err, result) => {
            if (!err) {
                console.log('create camp ',result.rows)
                res.render('campaign/delete', {cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows});
            } else {
                console.log('err', err);
                res.render('campaign', {cmpTitle: '', cmpDesc: '', cmpType: undefined});
            }
        });
        console.log('end of delete')
    } catch (e) {
        console.log('err at getdeleteInfo', e)
    }
}

module.exports.deleteCampaign = async function deleteCapaign(req, res, next) {
    try {
        console.log('inside delete');
        await pool.query('delete from "ad_content" where adv_id=($1)',[req.body.compType], (err, result) => {
            if (!err) {
                console.log('delete camp ',result)
                res.redirect('/campaign'); //{cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows[result.rows.length-1]});
            } else {
                console.log('err', err);
                res.render('campaign', {cmpTitle: '', cmpDesc: '', cmpType: undefined});
            }
        });
    } catch (e) {
        console.log('err at delete', e)
    }
}
