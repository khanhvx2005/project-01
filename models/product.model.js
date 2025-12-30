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
        totalStock: Number,
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
        variants: [
            {
                size: String,
                color: String,
                stock: Number
            }
        ]



    }, { timestamps: true });
const Product = mongoose.model('Product', productsSchema, "products");
module.exports = Product;