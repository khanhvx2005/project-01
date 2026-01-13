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
        ],
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date

        },
        updatedBy: [{
            account_id: String,
            updatedAt: Date
        }],
        priceNew: {
            type: Number,
            default: 0
        }






    });
const Product = mongoose.model('Product', productsSchema, "products");
module.exports = Product;