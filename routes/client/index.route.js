const homeRoute = require("./home.route")
const productRoute = require("./product.route")
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const searchRoute = require('./search.route')
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const cartRoute = require("./cart.route")
const checkoutRoute = require("./checkout.route")
const userRoute = require("./user.route")
const userMiddleware = require("../../middlewares/client/user.middleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.userInfo)
    app.use('/products', productRoute)
    app.use('/search', searchRoute)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRoute)
    app.use('/user', userRoute)
    app.use('/', homeRoute)



}
