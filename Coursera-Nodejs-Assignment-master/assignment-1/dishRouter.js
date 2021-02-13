const express = require("express");
const bodyParser = require("body-parser");
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//for handling GET Method with "dishId" 
dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    console.log(req);
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post((req, res, next) => {
    res.write('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    res.write(' with dishId '+req.params.dishId);
    res.end();
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting dish with dishId: '+req.params.dishId);
});


dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});


module.exports = dishRouter;