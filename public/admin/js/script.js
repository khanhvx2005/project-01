//1: Tính năng lọc trạng thái đang bán , hết hàng
const selectStatus = document.querySelector(".select-status");
if (selectStatus) {
    const url = new URL(window.location.href);
    selectStatus.addEventListener("change", (e) => {
        const status = e.target.value;
        if (status) {
            url.searchParams.set("status", status)
        } else {
            url.searchParams.delete("status");
        }
        window.location.href = url.href;

    })
}
//End  Tính năng lọc trạng thái đang bán , hết hàng

//2: Tính năng tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
    const url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href;

    })
}
// End tính năng tìm kiếm

//3: Logic xử lý sidebar
// Lấy đường dẫn hiện tại (Ví dụ: /admin/products)
const currentPath = window.location.pathname;

const sidebarLinks = document.querySelectorAll(".sidebar__link");

if (sidebarLinks) {
    sidebarLinks.forEach((link) => {
        // Lấy giá trị href của thẻ a
        // getAttribute("href") sẽ lấy giá trị thô, ví dụ: "/admin/products"
        const linkPath = link.getAttribute("href");

        // Kiểm tra xem href có khớp với đường dẫn hiện tại không
        // Hoặc kiểm tra active cho cả mục con (nếu cần)
        if (linkPath === currentPath) {
            link.classList.add("sidebar__link--active");
        }
    });
}
// End logic xử lý sidebar
