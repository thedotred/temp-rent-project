var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Collection/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Collection Lists"',
        title: "Collection Lists"
    });
});

module.exports = router;