var express = require('express');
const pool = require("../model/database");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // insert('location', '93, \'SriLanka\'');
    pool.query('SELECT * FROM location ORDER BY lname ASC', (error, result) => {
        if (error) {
            throw error
        }
        console.log(result);
        res.render('dashboard', {title: 'Express', data: result.rows}); // JSON.stringify(result.rows)
    });
    // res.render('index', {title: 'Express', data: 'no data'});
});

module.exports = router;
