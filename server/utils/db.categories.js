var db = require('../models/db.model');
const Category = db.categories;

class CategoriesDBUtils {

    static getCategoryById = async (query) => await Category.findOne({ where: { id: query } });

    static getCategories = async (query) => {
        if (query) return await Category.findAndCountAll({ where: query });
        return await Category.findAndCountAll();
    };
    
    static createCategory = async (data) => {
        return await Category.create({
            title: data.title,
        });
    };

    static updateCategory = async (data) => {
        return await Category.update({
            title: data.title,
        }, { where: { id: data.id } });
    };

    static deleteCategory = async (id) => {
        const toBeDeletedCategory = await Category.findOne({ where: { id } });
        return await toBeDeletedCategory.destroy();
    };

}

module.exports = CategoriesDBUtils;