const AppError = require('../utils/appError');
const MoviesDBUtils = require('../utils/db.movies')
const fs = require('fs')
const sharp = require("sharp");
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink)
const CategorysDBUtils = require('../utils/db.categories')

const getMovies = async (req, res, next) => {
    try {
        const query = req.query;
        const foundMovies = await MoviesDBUtils.getMovies(query);
        if (!foundMovies) return next(new AppError("Something wrong happened", 500));
        res.status(200).send({ status: 'success', data: foundMovies });
    } catch (err) {
        next(err);
    }
}

const createMovie = async (req, res, next) => {
    try {
        const { title, desc, rate, categoryId } = req.body;
        const img = req.file?.filename;
        if (!title?.trim() || !desc?.trim() || !rate?.trim() || !categoryId?.trim() || !img?.trim()) {
            return next(new AppError("Some required data is missing", 400));               
        }
        const foundCategory = await CategorysDBUtils.getCategoryById(categoryId);
        if (!foundCategory) return next(new AppError("Category not found!", 404));   
        const createdMovie = await MoviesDBUtils.createMovie({
            title,
            desc,
            img,
            rate,
            categoryId
        });
        if (!createdMovie) return next(new AppError("Something wrong happened", 500));
        const imageNameWithId = `movie-${createdMovie.id}.${img.split('.').pop()}`;
        createdMovie.img = imageNameWithId;
        
        if (!fs.existsSync(`public/img/movies/`)){
            fs.mkdirSync(`public/img/movies/`);
        }
        await sharp(req.file?.buffer)
            .toFormat("png")            
            .toFile(`public/img/movies/${imageNameWithId}`);
        await createdMovie.save();
        res.status(201).send({ status: 'success', data: createdMovie });
    } catch (err) {
        next(err);
    }

}

const updateMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, desc, rate, categoryId } = req.body;
        const img = req.file?.filename;
        if (title && !title.trim() || desc&& !desc.trim() || rate && !rate.trim() || categoryId && !categoryId.trim()) {
            return next(new AppError("Some data is invalid", 400));               
        };
        const foundCategory = await CategorysDBUtils.getCategoryById(categoryId);
        if (!foundCategory) return next(new AppError("Category not found!", 404));        
        const foundMovie = await MoviesDBUtils.getMovieById(id);
        if (!foundMovie) return next(new AppError("Movie not found!", 404));
        const updatedMovie = await MoviesDBUtils.updateMovie({
            id,
            title,
            desc,
            img,
            rate,
            categoryId
        });
        if (!updatedMovie) return next(new AppError("Something wrong happened", 500));
        if (img) {
            const imageNameWithId = `movie-${foundMovie.id}.png}`
            foundMovie.img = imageNameWithId;
            await foundMovie.save();
            if (!fs.existsSync(`public/img/movies/`)){
                fs.mkdirSync(`public/img/movies/`);
            }
            await sharp(req.file?.buffer)
                .toFormat("png")                
                .toFile(`public/img/movies/${imageNameWithId}`);
        }
        const foundUpdatedMovie = await MoviesDBUtils.getMovieById(id);
        res.status(201).send({status: 'success', data: foundUpdatedMovie })
    } catch (err) {
        next(err);
    }

}

const deleteMovie = async (req, res, next)=>{
    try {
        const { id } = req.params;
        const foundMovie = await MoviesDBUtils.getMovieById(id);
        if (!foundMovie) return next(new AppError("Movie not found!", 404));
        const deleteMovie = await MoviesDBUtils.deleteMovie(id);
        if (!deleteMovie) return next(new AppError("Something wrong happened", 500));
        if (fs.existsSync(`public/img/movies/movie-${foundMovie.id}.png`)) {
            await unlinkAsync(`public/img/movies/movie-${foundMovie.id}.png`);
        }
        res.status(200).send({ status: 'success', data: foundMovie });

    } catch (err) {
        next(err);
    }
}

module.exports = { createMovie, updateMovie, deleteMovie, getMovies }