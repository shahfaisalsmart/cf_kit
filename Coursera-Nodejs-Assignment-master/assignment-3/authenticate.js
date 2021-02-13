var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//"user" param. is used as a payload when you create jwt token
exports.getToken = function(user) {
    console.log("111: ", user);
    //first serialize the user and then
    //create json web Token 
    //json Web Token is not understandable by simplying looking into it, 
    //although it contains user info.
    return jwt.sign(user, config.secretKey,
        {expiresIn: 7200});	//(3600 seconds) Time Duration After which it will get expired
};

var opts = {};     //js object
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//to extract the json token 
//from client i/p
//will execute whenever any
//http req. is made (get/post/put/delete)
opts.secretOrKey = config.secretKey;                               

console.log("111: ", opts.jwtFromRequest);
console.log("222: ", opts.secretOrKey);
//JSON based Strategy

exports.jwtPassport = passport.use(new JwtStrategy(opts,(jwt_payload, done) => {
    
    console.log("JWT payload: ", jwt_payload);  
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) 
            return done(err, false);
        else if (user) 
            return done(null, user);
        else 
            return done(null, false);
    });
}));


exports.verifyUser = passport.authenticate('jwt', {session: false});
//to verify the user We will use the "jwt" if it was added in the auth header


exports.verifyAdmin = (req, callBack)=>{

    console.log("req:", req);   //json Obj {...}
    console.log("admin:", req.admin);
    var admin = req.admin;
    if(admin==true)
    {
        console.log("I am admin");
        callBack(null,true);
        return;
    }
    callBack("You are not authorized to perform this operation!", null);
    next();
};
