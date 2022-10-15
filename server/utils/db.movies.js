var db = require('../models/db.model');
const Movie = db.movies;

class MoviesDBUtils {

    static getMovieById = async (query) => await Movie.findOne({ where: { id: query } });

    static getMovies = async (query) => {
        if (query) return await Movie.findAndCountAll({ where: query });
        return await Movie.findAndCountAll();
    };
    
    static createMovie = async (data) => { 
        return await Movie.create({
            title: data.title,
            desc: data.desc,
            img: data.img,
            rate: data.rate,
            categoryId: data.categoryId,
        });
    };

    static updateMovie = async (data) => {
        return await Movie.update({
            title: data.title,
            desc: data.desc,
            img: data.img,
            rate: data.rate,
            categoryId: data.categoryId,
        }, { where: { id: data.id } });
    };

    static deleteMovie = async (id) => {
        const toBeDeletedMovie = await Movie.findOne({ where: { id } });
        return await toBeDeletedMovie.destroy();
    };

}

module.exports = MoviesDBUtils;