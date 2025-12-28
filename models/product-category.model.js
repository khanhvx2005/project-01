const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const productCategorySchema = new mongoose.Schema(
    {
        title: String, // Tên danh mục
        parent_id: String, // Quan hệ cha con
        description: String, // Mô tả danh mục

        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        thumbnail: String,
        deletedAt: Date,
        slug: {
            type: "String",
            slug: "title",
            unique: true
        },



    }, { timestamps: true });
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products_category");
module.exports = ProductCategory;