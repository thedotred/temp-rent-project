const jwt = require('jsonwebtoken'),
{JWT_SECRET} = require('../configurations/config');

function requireLogIn(req,res,next)
{
    if(req.session && req.session.currentUser)
    {
        return next();
    } else
    {
        res.redirect('/Login');
    }
}

function requireToLogin(req,res,next)
{
    if(req.session && req.session.currentUser)
    {
        res.redirect('/');
    } else
    {
        return next();
    }
}

function redirectFromSignup(req,res,next)
{
    if(req.session && req.session.currentUser)
    {
        res.redirect('/');
    } else
    {
        return next();
    }
}

function redirectFromRecover(req,res,next)
{
    if(req.session && req.session.currentUser)
    {
        res.redirect('/');
    } else
    {
        return next();
    }
}

function userNav(req,res,next)
{
    if(req.session.userRole === "Developer" || req.session.userRole === "Superadmin")
    {
        return next();
    } else
    {
        if(req.session.navigationPolicy.findIndex(a=>a===req.originalUrl) > -1){
            next();
        } else{
            res.redirect('/');
        }
    }
}

function accessToAdminNavs(req,res,next)
{
    if(req.session.userRole === "Developer" || req.session.userRole === "Admin")
    {
        return next();
    } else
    {
        return res.redirect('/');
    }
}

function frontEndLogIn(req,res,next)
{
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const { email_id, _id } = decoded;
        req.email_id = email_id;
        req._id = _id;
        next();
    } catch {
        res.status(403).send('Forbidden');
    }
}

module.exports = {
    requireLogIn, 
    userNav, 
    redirectFromSignup, 
    requireToLogin, 
    redirectFromRecover, 
    accessToAdminNavs, 
    frontEndLogIn
};