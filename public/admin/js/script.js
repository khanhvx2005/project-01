//1: Tính năng lọc trạng thái đang bán , hết hàng
const selectStatus = document.querySelector(".select-status");
if (selectStatus) {
    selectStatus.addEventListener("change", (e) => {
        const url = new URL(window.location.href);

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
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);

        const keyword = e.target.elements.keyword.value.trim(); // Dùng hàm trim để loại bỏ đi khoảng trắng ở đầu và cuối loại trừ trường hợp người dụng nhập dấu cách thì nhìn URL sẽ chuyên nghiệp hơn
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
        const linkPath = link.getAttribute("href");

        if (linkPath === currentPath) {
            link.classList.add("sidebar__link--active");
        }
    });
}
// End logic xử lý sidebar
//Xử lý phân trang
const pageItem = document.querySelectorAll(".page-item");
if (pageItem.length > 0) {
    const url = new URL(window.location.href);

    pageItem.forEach((item) => {
        item.addEventListener("click", () => {
            const page = item.getAttribute("page");
            if (page) {
                url.searchParams.set("page", page);

            }
            window.location.href = url.href;
        })
    })
}
// End xử lý phân trang

