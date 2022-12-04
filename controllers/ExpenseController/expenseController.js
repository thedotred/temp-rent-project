var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.render('Expense/Index', {
        layout: 'kendo',
        sessionData: req.session,
        nav_name: '" Expense "',
        title: "Expense Lists"
    });
});

module.exports = router;