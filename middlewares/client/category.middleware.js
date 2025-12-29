const ProductCategory = require("../../models/product-category.model");
module.exports.category = async (req, res, next) => {
    const find = {
        deleted: false,
        status: "active"

    }
    function createTree(arr, parent_id = "") {
        const tree = [];
        arr.forEach(item => {
            if (item.parent_id === parent_id) {
                const newItem = item;
                const children = createTree(arr, item.id)
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem)
            }
        });
        return tree;
    }

    const records = await ProductCategory.find(find);
    const newRecords = createTree(records)
    res.locals.layoutProductsCategory = newRecords;
    next()

}