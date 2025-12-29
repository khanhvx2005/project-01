const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const productsSchema = new mongoose.Schema(
    {
        title: String,
        product_category_id: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
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
        featured: String,
        color: {
            type: Array,
            default: []
        },
        size: {
            type: Array,
            default: []
        }


    }, { timestamps: true });
const Product = mongoose.model('Product', productsSchema, "products");
module.exports = Product;