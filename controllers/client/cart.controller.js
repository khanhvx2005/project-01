const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    /* 
    Trang giỏ hàng cần hiển thị tên sản phẩm , ảnh , slug , số lượng , màu ....
    Thông tin về số lượng và màu thì dễ dàng lấy được vì nó có trong collection cart
    Còn thông tin về tên sản phẩm , giá ... thì lấy thông qua key product_id
    */

    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    })
    for (const item of cart.products) {
        const productInfo = await Product.findOne({
            _id: item.product_id
        })

        item.productInfo = productInfo;
        item.totalPrice = productInfo.priceNew * item.quantity;
    }
    cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0)


    res.render("client/pages/cart/index", { title: "Trang giỏ hàng", cartDetail: cart })
}
module.exports.addPost = async (req, res) => {

    const productId = req.params.id;
    const cartId = req.cookies.cartId;
    const color = req.body.color;
    const size = req.body.size;
    const quantity = parseInt(req.body.quantity);

    /* 
    Chiến thuật Creation Lazy tạo trễ: Khi người dùng bấm vào thêm giỏ hàng thì mới tạo giở hàng và lưu sản phẩm vào trong giỏ hàng đấy luôn
    Nhưng không phải lần nào người dùng bấm thêm vào giỏ là cũng tạo ra giở hàng mới trong DB.
    Tách 2 khả năng
    Nếu lần đầu tiên thì mới tạo giỏ lưu trong DB đồng thời thêm logic thêm sản phẩm vào giỏ đấy.
    Từ lần 2 thì bạn push sản phẩm vào giỏ đã được tạo trước đó.
    */
    let cart = await Cart.findOne({
        _id: cartId
    })
    if (!cart) {
        cart = new Cart({
            _id: cartId,
            products: []
        })
        await cart.save()
        const objProduct = {
            product_id: productId,
            size: size,
            color: color,
            quantity: quantity
        }
        await Cart.updateOne({
            _id: cartId
        }, { products: objProduct })
        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
        const backURL = req.get("Referer");
        res.redirect(backURL)
    } else {


        /* Trường hợp từ lần 2: thì bạn xử lý logic thêm sản phẩm vào giỏ đã được tạo trước đó.
        Có 2 khả năng: 
        Nếu người dùng thêm sản phẩm cùng tên , size , màu thì chúng ta chỉ cập nhập số lượng của sản phẩm đó
        Nếu người dùng thêm sản phẩm hoàn toàn khác thì thêm sản phẩm đó vào trong DB.
        */
        const exits = cart.products.find((item) => item.product_id == productId && item.size === size && item.color === color)
        if (exits) {
            const newQuantity = quantity + exits.quantity;
            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            }, {
                $set: {
                    "products.$.quantity": newQuantity
                }
            })
            req.flash("success", "Thêm sản phẩm vào giỏ thành công");
            const backURL = req.get("Referer")
            res.redirect(backURL)
        } else {
            const objProduct = {
                product_id: productId,
                size: size,
                color: color,
                quantity: quantity
            }
            await Cart.updateOne({
                _id: cartId
            }, { $push: { products: objProduct } })
            req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
            const backURL = req.get("Referer");
            res.redirect(backURL)
        }
    }

}
module.exports.updateQuantity = async (req, res) => {
    const quantity = parseInt(req.params.quantity)
    const productId = req.params.productId;
    const size = req.params.size;
    const color = req.params.color;
    await Cart.updateOne({
        _id: req.cookies.cartId,
        "products.product_id": productId,
        "products.size": size,
        "products.color": color,

    }, {
        $set: {
            "products.$.quantity": quantity
        }
    })
    req.flash("success", "Cập nhập số lượng sản phẩm thành công !")
    const backURL = req.get("Referer");
    res.redirect(backURL)
}
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const color = req.params.color;
    const size = req.params.size;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: { product_id: productId, size: size, color: color }
        }
    })
    req.flash("success", "Xóa sản phẩm thành công !");
    const backURL = req.get("Referer");
    res.redirect(backURL)

}
