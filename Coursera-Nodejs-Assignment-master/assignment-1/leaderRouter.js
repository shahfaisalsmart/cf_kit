const express = require("express");
const bodyParser = require("body-parser");
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//for handling GET Method with "leaderId" 
leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the leader : ' + req.params.leaderId +' to you!');
})
.post((req, res, next) => {
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write('Updating the leader: '+ req.params.leaderId+"\n");
    res.write('Will update the leader: '+ req.body.name + ' with details: ' +req.body.description);
    res.end();
})
.delete((req, res, next) => {
    res.end('Deleting the leader with leaderId: '+req.params.leaderId);
});


//for handling GET Method with no "leaderId" (
//i.e /-> rprsnts the root addr send to this page from "index.js")
leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('POST operation not supported');
})
.put((req, res, next) => {
    res.write('Updating all leaders');
    res.end();
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});

module.exports = leaderRouter;