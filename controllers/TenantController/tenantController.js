var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Tenant/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Tenant "',
        title: "Tenant Lists"
    });
});

module.exports = router;