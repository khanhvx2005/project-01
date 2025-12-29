// helpers/getDescendants.js
const ProductCategory = require("../models/product-category.model");

// Hàm đệ quy lấy tất cả ID con cháu
const getDescendants = async (parentId) => {
    // 1. Tìm tất cả con trực tiếp
    const children = await ProductCategory.find({
        parent_id: parentId,
        deleted: false
    });

    let allSubs = [...children]; // Mảng chứa kết quả

    // 2. Lặp qua từng đứa con để tìm cháu (Đệ quy)
    for (const child of children) {
        const grandChildren = await getDescendants(child.id);
        // Nối mảng cháu vào mảng kết quả
        allSubs = allSubs.concat(grandChildren);
    }

    return allSubs;
}

module.exports = getDescendants;