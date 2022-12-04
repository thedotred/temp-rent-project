var express = require('express');
var router = express.Router();

// define the home page route
router.get('/Collection', function (req, res) {
    res.render('Report/Collection', {
        layout: 'kendo',
        sessionData: req.session,
        title: 'Collection report',
        nav_name: '" Collection Report"',
        title: "Collection Report"
    });
});

router.get('/Profitability', function (req, res) {
    res.render('Report/Profitability', {
        layout: 'kendo',
        sessionData: req.session,
        title: 'Profitability report',
        nav_name: '" Profitability Report"',
        title: "Profitability Report"
    });
});

router.get('/Profitability/Property', function (req, res) {
    res.render('Report/Property', {
        layout: 'kendo',
        sessionData: req.session,
        title: 'Profitability report',
        nav_name: '" Profitability Report"',
        title: "Profitability Report"
    });
});

router.get('/Tenant', function (req, res) {
    res.render('Report/Tenant', {
        layout: 'kendo',
        sessionData: req.session,
        title: 'Tenant report',
        nav_name: '" Tenant Report"',
        title: "Tenant Report"
    });
});

module.exports = router;