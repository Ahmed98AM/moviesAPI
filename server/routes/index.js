"use strict";
const express = require('express');
const userController = require('../controllers/user.controller');
const categoryController = require('../controllers/category.controller');
const movieController = require('../controllers/movie.controller');
const uploadImg = require('../middleware/uploadImg.middleware');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const appRouter = (app) => {
    router.get('/movies/', auth.isLoggedIn, movieController.getMovies);
    router.post('/movies/', auth.isLoggedIn, uploadImg.upload.single("img"), uploadImg.convert, movieController.createMovie);
    router.put('/movie/:id', auth.isLoggedIn, uploadImg.upload.single("img"), uploadImg.convert, movieController.updateMovie);
    router.delete('/movie/:id', movieController.deleteMovie);
    
    router.get('/categories/', auth.isLoggedIn, categoryController.getCategories);
    router.post('/categories/', auth.isLoggedIn, categoryController.createCategory);
    router.put('/category/:id', auth.isLoggedIn, categoryController.updateCategory);
    router.delete('/category/:id', auth.isLoggedIn, categoryController.deleteCategory);
    
    router.get('/users/', auth.isLoggedIn, userController.getUsers);
    router.post('/signup/', userController.signUp);
    router.post('/login', userController.logIn);
    router.post('/logout', auth.isLoggedIn, userController.logOut);


    app.use('/', router);
};
module.exports = appRouter;
