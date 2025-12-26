const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
    {
        title: String,
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
        deletedAt: Date


    }, { timestamps: true });
const Product = mongoose.model('Product', productsSchema, "products");
module.exports = Product;