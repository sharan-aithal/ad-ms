var express = require('express');
var router = express.Router();
const {
    deleteOrder,
    cancelOrder,
    getOrderDetails,
    getOrderList
} = require("../functions/userOrder");

router.get('/', function (req, res, next) {
    // /order list
    getOrderList(req, res, next).then(r => console.log('r list', r));
    // res.render('campaign/index');
});

router.get('/details/:oid', function (req, res, next) {
    // /order/profile page of user
    // res.render('campaign/create', {cmpName: '', cmpTitle: '', cmpDesc: '', cmpContent: ''});
    getOrderDetails(req, res, next).then(r => console.log('r say ', r));
});

router.post('/order', function (req, res, next) {
    // /order/profile page of user
    // res.render('campaign/create');
    // createCampaign(req, res, next).then(r => console.log('r then', r));
});

router.get('/pay', function (req, res, next) {
    // /order/pay page of user
    // res.render('campaign/update');
});

router.post('/pay', function (req, res, next) {
    // /order/pay page of user
    res.render('campaign/update');
});

router.get('/cancel/:oid', function (req, res, next) {
    // /order/cancel page of user
    // res.render('campaign/delete');
    res.render('order/cancel', {order_id: req.params.oid} )
});

router.post('/cancel', function (req, res, next) {
    // /order/cancel page of user
    // res.render('campaign/delete');
    cancelOrder(req, res, next).then(r => console.log('r is cancel', r))
});

router.post('/delete', function (req, res, next) {
    // /order/cancel page of user
    // res.render('campaign/delete');
    deleteOrder(req, res, next).then(r => console.log('r is delete', r))
});

module.exports = router;
