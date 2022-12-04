var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Unit/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Unit "',
        title: "Unit Lists"
    });
});

module.exports = router;