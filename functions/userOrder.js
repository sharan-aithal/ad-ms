const pool = require("../config/database");

module.exports = {
    getOrderList: async function(req, res, next) {
        try {
            console.log('inside getOrderList', req.user);
            await pool.query('select * from "orders" where order_user=($1)',[req.user[0].email], (err, result) => {
                if (err) {
                    console.log('getOrderList err ',result)
                    res.redirect('/account'); //{cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows[result.rows.length-1]});
                } else {
                    console.log('rowCount', result.rowCount);
                    res.render('order/orderList', {rowCount: result.rowCount, table: result.rows});
                }
            });
        } catch (e) {
            console.log('err at getOrderList', e)
        }
        return 'list'
    },

    getOrderDetails: async function(req, res, next) {
        try {
            console.log('inside getOrderDetails', req.params.oid);
            await pool.query('select * from "orders" o, "user" u, user_company c where order_user=($1) and order_id=($2) and u.email=o.order_user and u.email=c.c_user',[req.user[0].email, req.params.oid], (err, result) => {
                if (err) {
                    console.log('getOrderDetails err ',err)
                    res.redirect('/account'); //{cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows[result.rows.length-1]});
                } else {
                    console.log('orderDetails rowCount', result.rows);
                    res.render('order/details', {rowCount: result.rowCount, table: result.rows});
                }
            });
        } catch (e) {
            console.log('err at getOrderList', e)
        }
        return 'details'
    },

    cancelOrder: async function (req, res, next) {
        try {
            console.log('inside cancelOrder', req.user);
            await pool.query('update "orders" set order_status=($1) where order_user=($2) and order_id=($3)',['canceled', req.user[0].email, req.body.order_id], (err, result) => {
                if (err) {
                    console.log('cancel err ',err)
                    res.redirect('/order'); //{cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows[result.rows.length-1]});
                } else {
                    console.log('cancel rowCount', result);
                    res.redirect('/order')
                }
            });
        } catch (e) {
            console.log('err at cancelOrder', e)
        }
        return 'cancel'
    },

    deleteOrder: async function (req, res, next) {
        try {
            console.log('inside delete', req.user);
            await pool.query('delete from "orders" where order_user=($1) and order_id=($2)',[req.user[0].email, req.body.order_id], (err, result) => {
                if (err) {
                    console.log('deleteOrder err ',err)
                    res.redirect('/order'); //{cmpTitle: result.rows[0].adv_title, cmpDesc: result.rows[0].adv_desc, cmpType: result.rows[result.rows.length-1]});
                } else {
                    console.log('delete rowCount', result);
                    res.redirect('/order')
                }
            });
        } catch (e) {
            console.log('err at cancelOrder', e)
        }
        return 'delete'
    }
}
