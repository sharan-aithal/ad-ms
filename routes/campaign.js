var express = require('express');
var router = express.Router();
const {
    deleteCampaign,
    viewDeleteInfo,
    getList,
    createCampaign,
    getTypes
} = require("../functions/userCampaign");

router.get('/', function (req, res, next) {
    // /campaign list
    getList(req, res, next).then(r => console.log('r list', r));
    // res.render('campaign/index');
});

router.get('/create', function (req, res, next) {
    // /campaign/profile page of user
    // res.render('campaign/create', {cmpName: '', cmpTitle: '', cmpDesc: '', cmpContent: ''});
    getTypes(req, res, next).then(r => console.log('r say ', r));
});

router.post('/create', function (req, res, next) {
    // /campaign/profile page of user
    // res.render('campaign/create');
    createCampaign(req, res, next).then(r => console.log('r then', r));
});

router.get('/update', function (req, res, next) {
    // /campaign/update page of user
    res.render('campaign/update', {cmpTitle: '', cmpDesc: '', cmpType: undefined});
});

router.post('/update', function (req, res, next) {
    // /campaign/update page of user
    res.render('campaign/update');
});

router.get('/delete', function (req, res, next) {
    // /campaign/company page of user
    // res.render('campaign/delete');
    viewDeleteInfo(req, res, next).then(r => console.log('r is delete', r))
});

router.post('/delete', function (req, res, next) {
    // /campaign/company page of user
    // res.render('campaign/delete');
    deleteCampaign(req, res, next).then(r => console.log(r))
});

module.exports = router;
