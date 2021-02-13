const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
//authenticate for JWT have a look in authenticate.js file

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// if authenticate.verifyUser fails, it will throw error 
// hindering the flow of control going into the function 
.post(authenticate.verifyUser, (req, res, next) => {

    console.log("req.user:d: ",req.user);
    authenticate.verifyAdmin(req.user, (err, users)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);   
        }
        else
        {
            Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created ', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
        } 
    });
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    authenticate.verifyAdmin(req.user, (err, users)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);   
        }
        else
        {
            Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));    
        } 
    });
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    authenticate.verifyAdmin(req.user, (err, users)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);   
        }
        else
        {
            Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, { new: true }) //when updated thn that value will be returned back ...hold them in "dish"
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log("Put: ",dish);
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));    
        } 
    });
})
.delete(authenticate.verifyUser,(req, res, next) => {
    authenticate.verifyAdmin(req.user, (err, users)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);   
        }
        else
        {
            Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));    
        } 
    });
});

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) 
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else 
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) 
        {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })            
            }, (err) => next(err));
        }
        else 
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    authenticate.verifyAdmin(req.user, (err, users)=>{
        if(err)
        {
            err = new Error(err);
            err.status = 404;
            return next(err);   
        }
        else
        {
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) 
                {
                    for (var i = (dish.comments.length -1); i >= 0; i--)
                        dish.comments.id(dish.comments[i]._id).remove();
                    dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);                
                    }, (err) => next(err));
                }
                else
                {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));     
        } 
    });  
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')    
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) 
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) 
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else 
        {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
// .post(authenticate.verifyUser,(req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/'+ req.params.dishId
//         + '/comments/' + req.params.commentId);
// })
.put(authenticate.verifyUser, (req, res, next) => {
    console.log("get:: ", req.user._id);       //extracted from Bearer Token
    // console.log("get:: ", req.body.author);
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        // console.log("dish:::", dish);
        // console.log("dish.comments:::", dish.comments);
        // console.log("test::", dish.comments.id(req.params.commentId));

        var comment = dish.comments.id(req.params.commentId);
        var authorId = comment.author;
        var userId = req.user._id;
        console.log("::", comment.author);

        if(!userId.equals(authorId))
        {
            var err = new Error("You are not authorized to perform this operation!");
            err.status = 404;
            return next(err);
        }

        console.log("U r in!");

        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating)
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            if (req.body.comment)
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })              
            }, (err) => next(err));
        }
        else if (dish == null) 
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else 
        {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        console.log("::", comment.author);
        console.log("test::", dish.comments.author);

        var authorId = comment.author;
        var userId = req.user._id;

        if(!userId.equals(authorId))
        {
            var err = new Error("You are not authorized to perform this operation!");
            err.status = 404;
            return next(err);
        }

        console.log("U r in!");

        if (dish != null && dish.comments.id(req.params.commentId) != null) 
        {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })               
            }, (err) => next(err));
        }
        else if (dish == null) 
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else 
        {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;

