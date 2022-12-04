var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Ledger/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Ledger "',
        title: "Ledger Lists"
    });
});

module.exports = router;