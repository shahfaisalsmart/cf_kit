var express = require('express');
var createError = require('http-errors');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');


var router = express.Router();
router.use(bodyParser.json());


router.get("/", authenticate.verifyUser, function(req,res,next) {

    console.log("req.user:: ",req.user);
    console.log("req.body:: ",req.body);
    authenticate.verifyAdmin(req.user, (err, admin)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);
        }
        else
        {
            User.find((err,user)=>{
                console.log(user);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            });
        } 
    });
});

router.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) 
    {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
    }
    else 
    {
        if(req.body.firstname)
            user.firstname = req.body.firstname;
        if(req.body.lastname)
            user.lastname = req.body.lastname;
        user.save((err, user) => {
            if(err) 
            {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
                return ;
            }
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful!'});
            });
        });
    }
  });
});

// first authenticate the user using "local" strategy (using "usrname and pswd") 
// thereafter all req. header will carry the json token

// "passport.authenticate('local')" if authorization successful it will go inside 
// the function, else  it will through Error
//upon successful authorization, it will load "user" property to the "req" parametr.
router.post('/login', passport.authenticate('local'), (req, res) => {
    
    var token = authenticate.getToken({_id: req.user._id});  //JSON Web Token
                                //other user info can also be included in the json token
                                //but user _id is sufficient for all our needs.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
    if (req.session) 
    {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else 
    {
        err = new Error('You are not logged in!');
        err.status = 403;
        console.log(req.session);
        next(err);
    }
});

module.exports = router;
