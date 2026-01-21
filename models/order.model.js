const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
            email: String,
            note: String
        },
        products: [
            {
                product_id: String,
                title: String,
                thumbnail: String,
                size: String,
                color: String,
                price: Number,
                discountPercentage: Number, // % giảm lúc mua
                quantity: Number,
                totalPrice: Number
            }

        ],
        totalMoney: Number,
        // 4. TRẠNG THÁI THANH TOÁN (Phục vụ VNPAY)
        paymentMethod: {
            type: String,
            default: "COD" // hoặc "VNPAY", "MOMO"
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid"
        },
        // Lưu vết giao dịch VNPAY (Để đối soát khi lỗi)
        paymentInfo: {
            vnp_TransactionNo: String,
            vnp_BankCode: String,
            vnp_PayDate: String,
            vnp_OrderInfo: String
        },

        // 5. TRẠNG THÁI ĐƠN HÀNG (Quy trình xử lý)
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
            default: "pending"
        },

        // 6. QUẢN TRỊ
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date

    }, { timestamps: true });
const Order = mongoose.model('Order', orderSchema, "orders");
module.exports = Order;