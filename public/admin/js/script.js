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
// 5: Chuyển đổi trạng thái 1 sản phẩm
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("[form-change-status]");
    const path = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const status = button.getAttribute("data-status");
            let newStatus = "";
            if (status == "active") {
                newStatus = "inactive";
            } else {
                newStatus = "active";

            }
            formChangeStatus.action = `${path}/${newStatus}/${id}?_method=PATCH`;
            formChangeStatus.submit();
        })
    })
}
// End chuyển đổi trạng thái 1 sản phẩm

// 6: logic chuyển đổi trạng thái cho nhiều sản phẩm
const productTable = document.querySelector(".product-table");
if (productTable) {
    const inputCheckAll = productTable.querySelector("input[name='checkall']");
    const inputCheckIds = productTable.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", (e) => {
        const checked = inputCheckAll.checked;
        if (checked) {
            inputCheckIds.forEach((input) => {
                input.checked = true;
            })
        } else {
            inputCheckIds.forEach((input) => {
                input.checked = false;
            })
        }
    })
    inputCheckIds.forEach((input) => {
        input.addEventListener("click", (e) => {
            const countInputChecked = productTable.querySelectorAll("input[name='id']:checked").length;

            if (countInputChecked == inputCheckIds.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;

            }
        })
    })
}
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const typeChange = e.target.elements[1].value;
        if (typeChange == "delete-all") {
            const conFirm = confirm("Bạn có chắc chắc muốn xóa các sản phẩm đã chọn ?");
            if (!conFirm) {
                return;
            }
        }
        const productTable = document.querySelector(".product-table");

        const inputChecked = productTable.querySelectorAll("input[name='id']:checked");

        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach((input) => {
                if (typeChange == "change-position") {
                    const id = input.value;
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`)
                } else {
                    const id = input.value;
                    ids.push(id);
                }

            })

            inputIds.value = ids.join(",");
            formChangeMulti.submit();

        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }

    })
}
// end logic chuyển đổi trạng thái cho nhiều sản phẩm
// Xóa 1 sản phẩm
const buttonDeleteItem = document.querySelectorAll("[button-delete-item]");
if (buttonDeleteItem.length > 0) {
    const formDeleteItem = document.querySelector("[form-delete-item]");
    const path = formDeleteItem.getAttribute("path");
    buttonDeleteItem.forEach((button) => {
        button.addEventListener("click", () => {
            const isComfirm = confirm("Bạn có chắc chắn xóa sản phẩm không ?");
            if (!isComfirm) {
                return;
            }
            const id = button.getAttribute("data-id")
            formDeleteItem.action = `${path}/${id}?_method=DELETE`;
            formDeleteItem.submit();

        })
    })
}
// end xóa 1 sản phẩm
// thông báo
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
// upload image preview
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("input[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("img[upload-image-preview]");
    const uploadImageClose = uploadImage.querySelector("span[upload-image-close]");
    uploadImageInput.addEventListener("change", () => {
        const [file] = uploadImageInput.files;
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            uploadImageClose.style.display = "flex";
        }
    })
    uploadImageClose.addEventListener("click", () => {
        uploadImagePreview.src = "#";
        uploadImageInput.value = "";
        uploadImageClose.style.display = "none";
    })

}
// end upload image preview

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


