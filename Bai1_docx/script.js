$(document).ready(function(){
    // Cấu hình Tooltip Bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    // Select/Deselect tất cả các checkbox
    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function(){
        if(this.checked){
            checkbox.each(function(){
                this.checked = true;
            });
        } else{
            checkbox.each(function(){
                this.checked = false;
            });
        }
    });
    checkbox.click(function(){
        if(!this.checked){
            $("#selectAll").prop("checked", false);
        }
    });

    // Chức năng Edit (Sửa) - Lấy dữ liệu và điền vào form
    $(document).on("click", ".edit", function(){
        // Lấy dòng (row) chứa nút Edit được click
        var $row = $(this).closest("tr");
        
        // Lưu lại dòng đang sửa để sử dụng sau
        $("#editEmployeeModal").data("selectedRow", $row);

        // Lấy dữ liệu từ các cột của dòng đó
        var name = $row.find("td:eq(1)").text();
        var email = $row.find("td:eq(2)").text();
        var address = $row.find("td:eq(3)").text();
        var phone = $row.find("td:eq(4)").text();

        // Điền dữ liệu vào form trong modal "editEmployeeModal"
        $("#editEmployeeModal input[name='name']").val(name);
        $("#editEmployeeModal input[name='email']").val(email);
        $("#editEmployeeModal textarea[name='address']").val(address);
        $("#editEmployeeModal input[name='phone']").val(phone);
    });

    // Xử lý khi nhấn nút "Save" trong modal sửa
    $("#editEmployeeModal form").submit(function(e){
        e.preventDefault(); // Ngăn form submit mặc định

        var form = $(this);
        if (validateForm(form)) {
            // Lấy dữ liệu từ form
            var name = form.find("input[name='name']").val();
            var email = form.find("input[name='email']").val();
            var address = form.find("textarea[name='address']").val();
            var phone = form.find("input[name='phone']").val();

            // Cập nhật dữ liệu vào hàng đã chọn
            var $row = $("#editEmployeeModal").data("selectedRow");
            $row.find("td:eq(1)").text(name);
            $row.find("td:eq(2)").text(email);
            $row.find("td:eq(3)").text(address);
            $row.find("td:eq(4)").text(phone);

            // Đóng modal
            $("#editEmployeeModal").modal('hide');
        }
    });

    // Lưu hàng được chọn vào một biến tạm thời khi click vào nút xóa
    let selectedRowToDelete;

    $(document).on("click", ".delete", function(){
        // Lấy hàng (row) chứa nút Delete vừa được click
        selectedRowToDelete = $(this).closest("tr");
    });
    
    // Xử lý khi nhấn nút "Delete" trong modal xác nhận xóa
    $("#deleteEmployeeModal form").submit(function(e){
        e.preventDefault(); // Ngăn form submit mặc định

        // Kiểm tra nếu có hàng được chọn để xóa
        if (selectedRowToDelete) {
            // Chỉ xóa hàng đã được chọn
            selectedRowToDelete.remove();
            selectedRowToDelete = null; // Reset biến để tránh xóa nhầm
        }

        // Đóng modal
        $("#deleteEmployeeModal").modal('hide');
    });

    // Chức năng Add New (Thêm mới)
    $("#addEmployeeModal form").submit(function(e){
        e.preventDefault(); // Ngăn form submit mặc định

        var form = $(this);
        if (validateForm(form)) {
            // Lấy dữ liệu từ form
            var name = form.find("input[name='name']").val();
            var email = form.find("input[name='email']").val();
            var address = form.find("textarea[name='address']").val();
            var phone = form.find("input[name='phone']").val();

            // Tạo một hàng mới cho bảng
            var newRow = `
                <tr>
                    <td>
                        <span class="custom-checkbox">
                            <input type="checkbox" id="checkbox_new" name="options[]" value="1">
                            <label for="checkbox_new"></label>
                        </span>
                    </td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${address}</td>
                    <td>${phone}</td>
                    <td>
                        <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`;

            // Thêm hàng mới vào bảng
            $("table tbody").append(newRow);

            // Đóng modal và reset form
            $("#addEmployeeModal").modal('hide');
            form[0].reset();
        }
    });

    // Hàm validate form
    function validateForm(form) {
        let isValid = true;
        // Xóa tất cả các thông báo lỗi cũ
        form.find('.error-message').remove();
        form.find('.form-control').removeClass('is-invalid');

        // Lấy giá trị từ form
        var name = form.find("input[name='name']").val();
        var email = form.find("input[name='email']").val();
        var address = form.find("textarea[name='address']").val();
        var phone = form.find("input[name='phone']").val();

        // Kiểm tra tên
        if (name === "") {
            showError(form.find("input[name='name']"), "Tên không được để trống.");
            isValid = false;
        }

        // Kiểm tra email
        if (email === "") {
            showError(form.find("input[name='email']"), "Email không được để trống.");
            isValid = false;
        }

        // Kiểm tra địa chỉ
        if (address === "") {
            showError(form.find("textarea[name='address']"), "Địa chỉ không được để trống.");
            isValid = false;
        }

        // Kiểm tra số điện thoại
        if (phone === "") {
            showError(form.find("input[name='phone']"), "Số điện thoại không được để trống.");
            isValid = false;
        } else if (phone.length !== 10) {
            showError(form.find("input[name='phone']"), "Số điện thoại phải có 10 ký tự.");
            isValid = false;
        } else if (!phone.startsWith('0')) {
            showError(form.find("input[name='phone']"), "Số điện thoại phải bắt đầu bằng số 0.");
            isValid = false;
        } else if (isNaN(phone)) {
            showError(form.find("input[name='phone']"), "Số điện thoại phải là số.");
            isValid = false;
        }

        return isValid;
    }

    // Hàm hiển thị thông báo lỗi
    function showError(inputElement, message) {
        inputElement.addClass('is-invalid');
        inputElement.parent().append(`<div class="error-message text-danger mt-1">${message}</div>`);
    }
});