const { Category } = require("../../models/category/category.model");
const mongoose = require('mongoose');
const { throwNotFoundError, throwBadRequestError } = require("../../utilities/helper");

/**
 * 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user
 * @param { { [key: string]: any }} query
 * @returns { Category[] } categories
 */
async function getCategories(user, query) {
    if (query.id) {
        let ids = query.id.split(',');
        return getCategoriesByListId(ids);
    }

    const categories = await Category
        .find({ userId: user._id })
        .select('name icon description color');
    return categories;
}

/**
 * 
 * @param {String} id 
 * @returns { Category } category
 */
async function getCategoryById(id) {
    try {
        const category = await Category
            .findById(id)
            .select('name icon description');

        return category;
    } catch (e) {
        throwCategoryNotFound();
    }
}

/**
 * 
 * @param { String[] } ids 
 * @returns { Category[] } categories
 */
async function getCategoriesByListId(ids) {
    const objIds = ids.map(id => mongoose.Types.ObjectId(id));
    try {
        const categories = await Category
            .find({ _id: { $in: objIds } })
            .select('name icon color');
        
        return categories;
    } catch (e) {
        throwBadRequestError();
    }
}

/**
 * 
 * @param {{ name: String, icon: String, description: String }} form 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user 
 */
async function saveCategory(form, user) {
    const category = new Category({
        name: form.name,
        icon: form.icon,
        color: form.color,
        description: form.description,
        userId: user._id
    });

    await category.save();
}

/**
 * 
 * @param {{ name: String, icon: String, description: String }} form
 */
async function updateCategory(form) {
    try {
        let res = await Category.updateOne(
            { _id: form._id },
            { $set: form }
        );
    
        return res.nModified;
    } catch (e) {
        throwCategoryNotFound();
    }
}

async function deleteCategory(id, principal) {
    try {
        await Category.findOneAndDelete({ _id: id, userId: principal._id });
    } catch (e) {
        throwCategoryNotFound();
    }
}

function throwCategoryNotFound() {
    throwNotFoundError('Category not found.');
}

module.exports = {
    getCategories,
    getCategoryById,
    saveCategory,
    updateCategory,
    deleteCategory
}