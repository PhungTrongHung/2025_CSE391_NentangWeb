$(document).ready(function() {
    let transactions = [
        { stt: 1, name1: "Mai", name2: "Thục Anh", address: "23 Hoàng Đạo Thúy, Thanh Xuân, Hà Nội" },
        { stt: 2, name1: "Hoàng", name2: "Sinh Hồng", address: "23 Hoàng Đạo Thúy, Thanh Xuân, Hà Nội" },
        { stt: 3, name1: "Tính", name2: "Mai Trung", address: "1411 Đường Láng, Cầu Giấy, Hà Nội" },
        { stt: 4, name1: "Hồng", name2: "Nguyễn Văn", address: "1411 Đường Láng, Cầu Giấy, Hà Nội" },
    ];

    // Khởi tạo nextEmployeeId dựa trên dữ liệu có sẵn
    let nextEmployeeId = transactions.length > 0 ? Math.max(...transactions.map(t => t.stt)) + 1 : 1;

    // Cache các selector để tăng hiệu suất
    const employeeTableBody = $('#employeeTableBody');
    const addEmployeeModal = $('#addEmployeeModal');
    const editEmployeeModal = $('#editEmployeeModal');
    const deleteEmployeeModal = $('#deleteEmployeeModal');
    const addEmployeeForm = $('#addEmployeeForm');
    const editEmployeeForm = $('#editEmployeeForm');
    const confirmDeleteBtn = $('#confirmDeleteBtn');
    const bulkDeleteBtn = $('.btn-danger');
    const resultCountSpan = $('#resultCount');
    const checkAll = $('#checkAll');

    // Hàm cập nhật số lượng kết quả hiển thị
    function updateResultCount() {
        const totalRows = employeeTableBody.find('tr').length;
        if (totalRows > 0) {
            const lastStt = employeeTableBody.find('tr:last-child').find('td').eq(2).text();
            resultCountSpan.text(`Kết quả 1 đến ${lastStt}`);
        } else {
            resultCountSpan.text('Không có kết quả');
        }
    }

    // Hàm tạo hàng mới cho bảng
    function createEmployeeRow(id, name1, name2, address) {
        return `
            <tr>
                <td><input type="checkbox" data-id="${id}"></td>
                <td>
                    <a href="#viewEmployeeModal" class="view" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Xem">&#xE417;</i></a>
                    <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Sửa">&#xE254;</i></a>
                    <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Xóa">&#xE872;</i></a>
                </td>
                <td>${id}</td>
                <td>${name1}</td>
                <td>${name2}</td>
                <td>${address}</td>
                <td><button class="activity-toggle">X</button></td>
            </tr>
        `;
    }

    // Hàm hiển thị dữ liệu ban đầu từ mảng transactions
    function renderTransactions() {
        employeeTableBody.empty(); // Xóa các hàng cũ
        transactions.forEach(transaction => {
            const newRowHtml = createEmployeeRow(transaction.stt, transaction.name1, transaction.name2, transaction.address);
            employeeTableBody.append(newRowHtml);
        });
        updateResultCount();
    }

    // --- Các chức năng chính ---

    // Chức năng Thêm nhân viên
    addEmployeeForm.on('submit', function(e) {
        e.preventDefault();
        const name1 = $('#addName1').val();
        const name2 = $('#addName2').val();
        const address = $('#addAddress').val();
        
        // Thêm giao dịch mới vào mảng
        transactions.push({
            stt: nextEmployeeId,
            name1: name1,
            name2: name2,
            address: address
        });

        // Thêm hàng vào bảng
        const newRowHtml = createEmployeeRow(nextEmployeeId, name1, name2, address);
        employeeTableBody.append(newRowHtml);

        nextEmployeeId++;
        addEmployeeModal.modal('hide');
        this.reset();
        updateResultCount();
    });

    // Chức năng Sửa nhân viên
    employeeTableBody.on('click', '.edit', function() {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        const id = parseInt(cells.eq(2).text(), 10);
        const name1 = cells.eq(3).text();
        const name2 = cells.eq(4).text();
        const address = cells.eq(5).text();
        
        $('#editEmployeeId').val(id);
        $('#editName1').val(name1);
        $('#editName2').val(name2);
        $('#editAddress').val(address);
        
        editEmployeeForm.data('row', row);
    });

    editEmployeeForm.on('submit', function(e) {
        e.preventDefault();
        const row = $(this).data('row');
        if (row) {
            const id = parseInt($('#editEmployeeId').val(), 10);
            const name1 = $('#editName1').val();
            const name2 = $('#editName2').val();
            const address = $('#editAddress').val();
            
            // Cập nhật mảng transactions
            const transactionToUpdate = transactions.find(t => t.stt === id);
            if (transactionToUpdate) {
                transactionToUpdate.name1 = name1;
                transactionToUpdate.name2 = name2;
                transactionToUpdate.address = address;
            }

            // Cập nhật hàng trong bảng
            const cells = row.find('td');
            cells.eq(3).text(name1);
            cells.eq(4).text(name2);
            cells.eq(5).text(address);
        }
        editEmployeeModal.modal('hide');
        this.reset();
    });

    // Chức năng Xóa nhân viên
    employeeTableBody.on('click', '.delete', function() {
        const row = $(this).closest('tr');
        const id = parseInt(row.find('td').eq(2).text(), 10);
        confirmDeleteBtn.data('idToDelete', id);
        confirmDeleteBtn.data('isBulkDelete', false);
    });

    bulkDeleteBtn.on('click', function() {
        const selectedRows = employeeTableBody.find('input[type="checkbox"]:checked');
        if (selectedRows.length > 0) {
            deleteEmployeeModal.modal('show');
            confirmDeleteBtn.data('isBulkDelete', true);
        } else {
            alert('Vui lòng chọn ít nhất một nhân viên để xóa.');
        }
    });

    confirmDeleteBtn.on('click', function() {
        const isBulkDelete = $(this).data('isBulkDelete');
        if (isBulkDelete) {
            const idsToDelete = employeeTableBody.find('input[type="checkbox"]:checked').map(function() {
                return parseInt($(this).closest('tr').find('td').eq(2).text(), 10);
            }).get();
            
            // Lọc mảng transactions để xóa các mục đã chọn
            transactions = transactions.filter(t => !idsToDelete.includes(t.stt));
            
            employeeTableBody.find('input[type="checkbox"]:checked').closest('tr').remove();
        } else {
            const id = $(this).data('idToDelete');
            if (id) {
                // Xóa khỏi mảng transactions
                transactions = transactions.filter(t => t.stt !== id);
                
                // Xóa khỏi bảng
                employeeTableBody.find(`tr:has(td:eq(2):contains(${id}))`).remove();
            }
        }
        deleteEmployeeModal.modal('hide');
        updateResultCount();
    });

    // Xử lý nút "Hoạt động"
    employeeTableBody.on('click', '.activity-toggle', function() {
        const button = $(this);
        // Chuyển đổi giữa 'X' và '✓'
        if (button.text().trim() === 'X') {
            button.text('✓');
        } else {
            button.text('X');
        }
    });
    
    // Xử lý checkbox chọn tất cả
    checkAll.on('change', function() {
        employeeTableBody.find('input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    });

    // Gọi hàm hiển thị ban đầu khi trang tải xong
    renderTransactions();
});