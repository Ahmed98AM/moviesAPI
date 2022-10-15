const UsersDBUtils = require('../utils/db.users')
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const signUp = async (req, res, next) => {
    try {
        const { username, birthdate, email, password } = req.body;
        if (!email?.trim() || !password?.trim() || !username?.trim() || !birthdate?.trim()) {
            return next(new AppError("Some required data is missing", 400));               
        }
        
        const foundUser = await UsersDBUtils.getUserBy({ email });
        if (foundUser) return next(new AppError("User found with the same email!", 409));
        
        const createdUser = await UsersDBUtils.createUser({
            username, email, password, birthdate
        });
        if (!createdUser) return next(new AppError("Something went wrong", 500));
        req.session.user = createdUser;

        return res.status(201).send({ status: 'success', data: createdUser });
        
    } catch (err) {
        next(err);
    }
};

const logIn = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        if (!email?.trim() || !password?.trim()) {
            return next(new AppError("Some required data is missing", 400));               
        }
        const foundUser = await UsersDBUtils.getUserBy({ email });
        if (!foundUser) return next(new AppError("Incorrect email or password", 400));
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.hash);
        if (isPasswordCorrect) {
            req.session.user = foundUser; 
            return res.status(200).send({status: 'success' })
        } else {
            return next(new AppError("Incorrect email or password", 400));                            
        };
    } catch (err) {
        next(err);
    }
};

const logOut = async (req, res, next)=>{
    try {
        req.session.destroy(() => {
            res.clearCookie('session.user');
            return res.status(200).send({status: 'success' })
        });
    } catch (err) {
        next(err);
    }
}

const getUsers = async (req, res) => {
    try {
        const foundUsers = await UsersDBUtils.getUsers();
        if (!foundUsers) return next(new AppError("Something wrong happened", 500));
        res.status(200).send({ status: 'success', data: foundUsers });
    } catch (err) {
        next(err);
    }
};


module.exports = { signUp, logIn, logOut, getUsers};
