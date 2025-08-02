$(document).ready(function() {
    // Dữ liệu mẫu (sẽ bị mất khi tải lại trang)
    let transactions = [
        { id: 1102, customer: "Võ Hoài An", employee: "Mai Thục Anh", amount: 250000, date: "06 Tháng 6 2024 9:00" },
        { id: 1199, customer: "Hoàng Thị Thắng", employee: "Nguyễn Văn Hồng", amount: 600000, date: "06 Tháng 6 2024 9:03" },
        { id: 1239, customer: "Nguyễn Huy Quang", employee: "Nguyễn Văn Hồng", amount: 934000, date: "06 Tháng 6 2024 9:10" },
        { id: 1677, customer: "Huỳnh Văn Nam", employee: "Mai Thục Anh", amount: 150000, date: "06 Tháng 6 2024 9:20" },
        { id: 1439, customer: "Nguyễn Hồng Minh", employee: "Mai Thục Anh", amount: 354000, date: "06 Tháng 6 2024 9:24" }
    ];

    let nextId = 2000; // ID bắt đầu cho các giao dịch mới

    // --- Hàm render bảng ---
    // Tối ưu: tạo một mảng các chuỗi HTML rồi join lại để hiệu suất tốt hơn
    function renderTable() {
        const $tableBody = $('#transactionTableBody');
        $tableBody.empty(); // Xóa tất cả các hàng hiện có

        const rows = transactions.map(transaction => `
            <tr>
                <td><input type="checkbox" data-id="${transaction.id}"></td>
                <td>
                    <button class="btn btn-primary view-btn" data-id="${transaction.id}" title="Xem chi tiết"><i class="material-icons">&#xE417;</i></button>
                    <button class="btn btn-warning edit-btn" data-toggle="modal" data-target="#editTransactionModal" data-id="${transaction.id}" title="Chỉnh sửa"><i class="material-icons">&#xE254;</i></button>
                    <button class="btn btn-danger delete-btn" data-toggle="modal" data-target="#deleteTransactionModal" data-id="${transaction.id}" title="Xóa"><i class="material-icons">&#xE872;</i></button>
                </td>
                <td>${transaction.id}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.employee}</td>
                <td>${transaction.amount.toLocaleString('vi-VN')} VNĐ</td>
                <td>${transaction.date}</td>
            </tr>
        `);
        $tableBody.append(rows.join(''));
    }

    // Render bảng khi trang tải lần đầu
    renderTable();

    // --- Chức năng "Thêm giao dịch" ---
    $('#addTransactionForm').on('submit', function(e) {
        e.preventDefault();

        const customer = $('#addCustomer').val();
        const employee = $('#addEmployee').val();
        // Cải thiện: Sử dụng regex để chỉ lấy các chữ số
        const amount = parseFloat($('#addAmount').val().replace(/[^\d]/g, ''));

        if (isNaN(amount) || amount <= 0) {
            alert('Số tiền không hợp lệ. Vui lòng nhập một số dương.');
            return;
        }

        const now = new Date();
        const formattedDate = `${now.getDate()} Tháng ${now.getMonth() + 1} ${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newTransaction = {
            id: nextId++,
            customer: customer,
            employee: employee,
            amount: amount,
            date: formattedDate
        };

        transactions.push(newTransaction);
        renderTable();
        $('#addTransactionModal').modal('hide');
        this.reset(); // Dùng `this.reset()` để reset form nhanh hơn
    });
    
    // --- Chức năng "Sửa giao dịch" ---
    // Sử dụng event delegation cho các nút được tạo động
    $(document).on('click', '.edit-btn', function() {
        const idToEdit = $(this).data('id');
        const transactionToEdit = transactions.find(t => t.id === idToEdit);

        if (transactionToEdit) {
            $('#editTransactionId').val(transactionToEdit.id);
            $('#editCustomer').val(transactionToEdit.customer);
            $('#editEmployee').val(transactionToEdit.employee);
            $('#editAmount').val(transactionToEdit.amount);
        }
    });

    $('#editTransactionForm').on('submit', function(e) {
        e.preventDefault();

        const id = parseInt($('#editTransactionId').val());
        const customer = $('#editCustomer').val();
        const employee = $('#editEmployee').val();
        const amount = parseFloat($('#editAmount').val().replace(/[^\d]/g, ''));

        if (isNaN(amount) || amount <= 0) {
            alert('Số tiền không hợp lệ. Vui lòng nhập một số dương.');
            return;
        }

        const transactionIndex = transactions.findIndex(t => t.id === id);
        if (transactionIndex !== -1) {
            transactions[transactionIndex] = {
                ...transactions[transactionIndex], // Giữ lại các thuộc tính cũ
                customer: customer,
                employee: employee,
                amount: amount
            };
            renderTable();
            $('#editTransactionModal').modal('hide');
        }
    });

    // --- Chức năng "Xóa giao dịch" (một bản ghi) ---
    $(document).on('click', '.delete-btn', function() {
        const idToDelete = $(this).data('id');
        // Lưu ID vào thuộc tính data của nút xác nhận để tiện sử dụng
        $('#confirmDeleteBtn').data('id', idToDelete); 
    });

    $('#confirmDeleteBtn').on('click', function() {
        const idToDelete = $(this).data('id');
        // Filter ra các giao dịch có ID khác với ID cần xóa
        transactions = transactions.filter(t => t.id !== idToDelete); 
        renderTable();
        $('#deleteTransactionModal').modal('hide');
    });

    // --- Chức năng "Xem chi tiết" ---
    $(document).on('click', '.view-btn', function() {
        const idToView = $(this).data('id');
        const transactionToView = transactions.find(t => t.id === idToView);
        if (transactionToView) {
            alert(`Chi tiết giao dịch ID: ${transactionToView.id}\nKhách hàng: ${transactionToView.customer}\nNhân viên: ${transactionToView.employee}\nSố tiền: ${transactionToView.amount.toLocaleString('vi-VN')} VNĐ\nNgày mua: ${transactionToView.date}`);
        }
    });

    // --- Xóa các bản ghi đã chọn ---
    $('#deleteSelectedBtn').on('click', function() {
        const selectedIds = [];
        // Lấy tất cả checkbox đã được chọn và đẩy ID vào mảng
        $('#transactionTableBody input[type="checkbox"]:checked').each(function() {
            selectedIds.push($(this).data('id'));
        });

        if (selectedIds.length === 0) {
            alert('Vui lòng chọn ít nhất một bản ghi để xóa.');
            return;
        }

        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} bản ghi đã chọn?`)) {
            // Filter ra các giao dịch có ID không nằm trong mảng các ID đã chọn
            transactions = transactions.filter(t => !selectedIds.includes(t.id));
            renderTable();
        }
    });
    
    // --- Chọn/Bỏ chọn tất cả ---
    // Giả định bạn đã thêm <input type="checkbox" id="selectAllCheckboxes"> vào tiêu đề bảng
    $('#selectAllCheckboxes').on('change', function() {
        const isChecked = $(this).prop('checked');
        $('#transactionTableBody input[type="checkbox"]').prop('checked', isChecked);
    });
});