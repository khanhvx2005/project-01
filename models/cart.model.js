const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
                size: String,
                color: String
            }
        ]

    }, { timestamps: true }
);
// Sau 30 ngày kể từ khi tạo mongoDB tự động xóa giỏ hàng này
cartsSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 2592000 });
const Cart = mongoose.model('Cart', cartsSchema, "carts");
module.exports = Cart;