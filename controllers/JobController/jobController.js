var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Job/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Job "',
        title: "Job Lists"
    });
});

module.exports = router;