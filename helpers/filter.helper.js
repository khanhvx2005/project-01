module.exports = (query) => {
    const filter = [
        {
            name: "Tất cả",
            value: "",
            selected: false
        },
        {
            name: "Đang bán",
            value: "active",
            selected: false
        },
        {
            name: "Hết hàng",
            value: "inactive",
            selected: false
        }
    ]
    if (query.status) {
        const index = filter.findIndex((item) => item.value == query.status);
        filter[index].selected = true;
    } else {
        const index = filter.findIndex((item) => item.value == "");
        filter[index].selected = true;
    }
    return filter;
}