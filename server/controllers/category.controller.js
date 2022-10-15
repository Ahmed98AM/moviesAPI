const AppError = require('../utils/appError');
const CategoriesDBUtils = require('../utils/db.categories')

const getCategories = async (req, res, next) => {
    try {
        const foundCategories = await CategoriesDBUtils.getCategories();
        if (!foundCategories) return next(new AppError("Something wrong happened", 500));
        res.status(200).send({ status: 'success', data: foundCategories });
    } catch (err) {
        next(err);
    }

}

const createCategory = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title?.trim()) {
            return next(new AppError("Some required data is missing", 500));               
        };
        const createdCategory = await CategoriesDBUtils.createCategory({ title });
        if (!createdCategory) return next(new AppError("Something wrong happened", 500));
        return res.status(201).send({ status: 'success', data: createdCategory });
    } catch (err) {
        next(err);
    }

}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (title&& !title.trim()) {
            return next(new AppError("Some data is invalid", 400));               
        };
        const foundCategory = await CategoriesDBUtils.getCategoryById(id);
        if (!foundCategory) return next(new AppError("Category not found!", 404));
        const updatedCategory = await CategoriesDBUtils.updateCategory({
            id,
            title,
        });
        if (!updatedCategory) return next(new AppError("Something wrong happened", 500));
        const foundUpdatedCategory = await CategoriesDBUtils.getCategoryById(id);
        return res.status(201).send({ status: 'success', data: foundUpdatedCategory });
    } catch (err) {
        next(err);
    }

}

const deleteCategory = async (req, res, next)=>{
    try {
        const { id } = req.params;
        const foundCategory = await CategoriesDBUtils.getCategoryById(id);
        if (!foundCategory) return next(new AppError("Category not found!", 404));
        const deleteCategory = await CategoriesDBUtils.deleteCategory(id);
        if (!deleteCategory) return next(new AppError("Something wrong happened", 500));
        return res.status(200).send({status: 'success', data: foundCategory })

    } catch (err) {
        next(err);
    }
}

module.exports = { createCategory, updateCategory, deleteCategory, getCategories }