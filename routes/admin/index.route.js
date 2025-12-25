const productsRoute = require("./products.route")
const dashboardRoute = require("./dashboard.route")

const prefixAdmin = require("../../configs/configAdmin.config")
module.exports = (app) => {
    app.use(`${prefixAdmin}`, dashboardRoute)

    app.use(`${prefixAdmin}/products`, productsRoute)
}
