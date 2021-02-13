const express = require("express");
const bodyParser = require("body-parser");
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
 
promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})
.post((req, res, next) => {
    res.write('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
    res.write(' for id ' + req.params.promoId);
    res.end();
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write('Updating the promotion: '+ req.params.promoId+"\n");
    res.write('Will update the promotion: '+ req.body.name + ' with details: ' +req.body.description);
    res.end();
})
.delete((req, res, next) => {
    res.end('Deleting the promotion with promoId: '+req.params.promoId);
});



promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});


module.exports = promoRouter;