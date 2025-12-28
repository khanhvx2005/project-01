const productsRoute = require("./products.route")
const dashboardRoute = require("./dashboard.route")
const productCategoryRoute = require("./productCategory.route")
const prefixAdmin = require("../../configs/configAdmin.config")
module.exports = (app) => {
    app.use(`${prefixAdmin}`, dashboardRoute)

    app.use(`${prefixAdmin}/products`, productsRoute)
    app.use(`${prefixAdmin}/products-category`, productCategoryRoute)

}
