// tìm kiếm
document.addEventListener("DOMContentLoaded", function () {
    // 1. Khai báo các biến
    const searchTrigger = document.querySelector(".js-search-trigger"); // Nút kính lúp ở header
    const searchOverlay = document.getElementById("search-overlay");    // Lớp phủ
    const closeSearchBtn = document.querySelector(".js-close-search");  // Nút X
    const searchInput = searchOverlay.querySelector("input[name='keyword']");

    // 2. Hàm mở tìm kiếm
    if (searchTrigger && searchOverlay) {
        searchTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            searchOverlay.classList.add("active");

            // Tự động focus vào ô input sau khi mở (cho UX tốt hơn)
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        });
    }

    // 3. Hàm đóng tìm kiếm
    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener("click", function () {
            searchOverlay.classList.remove("active");
        });
    }

    // 4. Đóng khi bấm phím ESC
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
            searchOverlay.classList.remove("active");
        }
    });
});
// end tìm kiếm
//4: Xử lý phân trang
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
// Sắp xếp
const selectSort = document.querySelector(".select-sort");
if (selectSort) {
    const url = new URL(window.location.href);
    selectSort.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("_");
        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey)
            url.searchParams.set("sortValue", sortValue)
        } else {
            url.searchParams.delete("sortKey")
            url.searchParams.delete("sortValue")
        }
        window.location.href = url.href;
    })
    const value = url.searchParams.get("sortValue");
    const key = url.searchParams.get("sortKey");
    const string = `${key}_${value}`;
    const option = selectSort.querySelectorAll("option[value]");
    option.forEach((item) => {
        const value = item.getAttribute("value");
        if (string == value) {
            item.selected = true;
        }
    })
}
// end sắp xếp 
// sap xep theo gia
function handleChangePrice(target) {
    // Lấy toàn bộ URL hiện tại (bao gồm cả ?page=1&sort=...)
    const url = new URL(window.location.href);

    // Kiểm tra hành động là Check hay Uncheck
    if (target.checked) {
        // NẾU CHECK: Gán giá trị vào URL (Ghi đè nếu đã có)
        url.searchParams.set('priceRange', target.value);
    } else {
        // NẾU UNCHECK: Xóa tham số priceRange khỏi URL
        url.searchParams.delete('priceRange');
    }

    // Chuyển hướng sang URL mới
    window.location.href = url.href;
}
// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
    const closeAlert = showAlert.querySelector("[close-alert]");

    // Hàm đóng thông báo
    const close = () => {
        showAlert.classList.add("alert-hidden");
        // Đợi animation chạy xong (0.5s) mới xóa khỏi DOM
        setTimeout(() => {
            showAlert.remove();
        }, 500);
    };

    // Tự động đóng sau thời gian quy định
    setTimeout(() => {
        close();
    }, time);

    // Đóng khi click nút X
    if (closeAlert) {
        closeAlert.addEventListener("click", () => {
            close();
        });
    }
}
// end thông báo
