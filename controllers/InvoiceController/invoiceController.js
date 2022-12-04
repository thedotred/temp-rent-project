var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Invoice/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Invoice "',
        title: "Invoice Lists"
    });
});

module.exports = router;