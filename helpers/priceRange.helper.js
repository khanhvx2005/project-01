module.exports = (query, find) => {
    const priceRange = query.priceRange;

    if (priceRange) {
        // Tách chuỗi "100000-300000" thành mảng [100000, 300000]
        const [min, max] = priceRange.split('-');

        // Khởi tạo object truy vấn cho priceNew
        find.priceNew = {};

        // Nếu có min (Lớn hơn hoặc bằng)
        if (min) {
            find.priceNew.$gte = parseInt(min);
        }

        // Nếu có max (Nhỏ hơn hoặc bằng)
        if (max) {
            find.priceNew.$lte = parseInt(max);
        }
    }
    return priceRange;
}