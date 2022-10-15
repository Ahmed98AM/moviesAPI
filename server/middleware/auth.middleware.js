const AppError = require('../utils/appError');

class RouteValidation{
    static isLoggedIn = async (req, res, next) => {
        if (!(req.session && req.session.user)) return next(new AppError("You are not logged in", 500));
        if (req.session.cookie._expires.getTime() < new Date().getTime()) next(new AppError("You are not logged in", 500));
        next();
    }
}



module.exports = RouteValidation;
