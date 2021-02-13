const cors = require('./cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            if (favorites) {
                user_favorites = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user_favorites) {
                    var err = new Error('Empty!');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(user_favorites);
            } else {
                var err = new Error('Empty');
                err.status = 404;
                return next(err);
            }

        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var user=null;
                if(favorites)
                    user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user) 
                    user = new Favorites({user: req.user.id});
                for(const x of req.body){
                    if(user.dishes.find((retVal) => {
                        if(retVal._id){
                            return retVal._id.toString() === x._id.toString();
                        }
                    }))
                        continue;
                    user.dishes.push(x._id);
                }
                user.save()
                    .then((favs) => {
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favs);
                        console.log("Favorites Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));

            })
            .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            var removeFav=null;
            if (favorites) {
                removeFav = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            } 
            if(removeFav){
                removeFav.remove()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));

            } else {
                var err = new Error('Empty!');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            if (favorites) {
                const favs = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                const dish = favs.dishes.filter(dish => dish.id === req.params.dishId)[0];
                if(dish) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                } else {
                    var err = new Error('You do not have dish ' + req.params.dishId);
                    err.status = 404;
                    return next(err);
                }
            } else {
                var err = new Error('Empty!');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var user = null;
                if(favorites)
                    user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user) 
                    user = new Favorites({user: req.user.id});
                if(!user.dishes.find((retVal) => {
                    if(retVal._id)
                        return retVal._id.toString() === req.params.dishId.toString();
                }))
                    user.dishes.push(req.params.dishId);

                user.save()
                    .then((favs) => {
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favs);
                        console.log("Favorites Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));

            })
            .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites/:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            var user = null;
            if(favorites)
                user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            if(user){
                user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
                user.save()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));

            } else {
                var err = new Error('Empty!');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = favouriteRouter;