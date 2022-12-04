var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Property/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Property "',
        title: "Property Lists"
    });
});

router.get('/Create', function (req, res) {
    res.render('Property/Create', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Property & Unit "',
        title: "Property & Unit Create"
    });
});

module.exports = router;