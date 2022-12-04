const express = require('express'),
router = express.Router();

router.get('/', (req, res)=>{
    res.render('Template/Index', {
        layout: 'kendo',
        sessionData: req.session,
        title: 'Template Lists',
        nav_name: '" Template Lists"'
    });
});

router.get('/Designer', (req, res)=>{
    res.render('Template/Designer', {
        layout: null,
        sessionData: req.session,
        nav_name: '" Template Designer"'
    });
});

module.exports = router;