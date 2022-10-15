module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('movie', {
        title: {
            type: DataTypes.STRING
        },
        desc: {
            type: DataTypes.STRING
        },
        rate: {
            type: DataTypes.INTEGER
        },
        img: {
            type: DataTypes.STRING
        }
    });
    return Movie;
}    
