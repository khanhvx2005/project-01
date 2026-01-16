const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const mongoose = require('mongoose')
module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const ObjectId = mongoose.Types.ObjectId;
        const cartId = new ObjectId;
        const expiresCookies = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cartId, { expires: new Date(Date.now() + expiresCookies) });

    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })

        if (cart) {
            for (const item of cart.products) {
                const productInCart = await Product.findOne({
                    _id: item.product_id,
                    deleted: false,
                    status: "active" // Nên thêm check active
                }); // Lấy thêm giá để tính toán
                if (productInCart) {
                    item.productInfo = productInCart;
                }
                const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)
                cart.totalQuantity = totalQuantity;
                res.locals.miniCart = cart;
            }
        }

        next()
    }
}