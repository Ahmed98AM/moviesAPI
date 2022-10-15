"use strict";
const { Sequelize } = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME || 'test', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
    host: process.env.DB_HOST || 'mysql',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8'
    }
});
var db = {};
async function dbConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (err) {
        console.log('Unable to connect to the database:', err);
    }
}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.movies = require('./movie.model')(sequelize, Sequelize);
db.categories = require('./category.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);

db.categories.hasMany(db.movies, { as: "movies" });
db.movies.belongsTo(db.categories, {
    foreignKey: "categoryId",
    as: "category"
});

module.exports = { dbConnection };
module.exports = db;
