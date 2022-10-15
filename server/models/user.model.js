module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
        },
        birthdate: {
            type: DataTypes.DATE,
        },
        hash: {
            type: DataTypes.STRING
        }
    });
    return User;
};
