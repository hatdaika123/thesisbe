const { ErrorDTOBuilder } = require("../../dto/error.dto");
const { Category } = require("../../models/category/category.model");
const HTTP_STATUS = require('http-status');

/**
 * 
 * @param {{ username: String, _id: String, iat: Number, exp: Number }} user 
 * @returns { Category[] } categories
 */
async function getAllCategory(user) {
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
            .findOne({ _id: id })
            .select('name icon description');
        
        if (!category) throwNotFoundError();

        return category;
    } catch (e) {
        throwNotFoundError();
    }
}

/**
 * throw error
 */
function throwNotFoundError() {
    throw new ErrorDTOBuilder()
        .setStatus(HTTP_STATUS.NOT_FOUND)
        .setMessage('Category not found.')
        .build();
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
        throwNotFoundError();
    }
}

async function deleteCategory(id, principal) {
    try {
        await Category.findOneAndDelete({ _id: id, userId: principal._id });
    } catch (e) {
        throwNotFoundError();
    }
}

module.exports = {
    getAllCategory,
    getCategoryById,
    saveCategory,
    updateCategory,
    deleteCategory
}