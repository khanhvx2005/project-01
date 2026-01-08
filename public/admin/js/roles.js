const buttonSubmit = document.querySelector("[button-submit]");
if (buttonSubmit) {


    buttonSubmit.addEventListener("click", () => {
        const tablePermissions = document.querySelector("[table-permissions]");
        const rows = tablePermissions.querySelectorAll("[data-name]");

        const permissions = [];
        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const input = row.querySelectorAll("input")

            if (name == "id") {
                input.forEach((input) => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                });

            } else {
                input.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }

    })
}
const records = document.querySelector("[data-records]");
if (records) {
    const dataRecords = JSON.parse(records.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]"); // lấy ra bảng
    // console.log(dataRecords);
    // console.log(tablePermissions);
    dataRecords.forEach((item, index) => {
        const permissions = (item.permission);

        permissions.forEach((element) => {

            const rows = tablePermissions.querySelector(`[data-name='${element}']`);  // lấy ra các hàng trong bảng


            const input = rows.querySelectorAll("input")[index];
            input.checked = true;



        })
    })


}
