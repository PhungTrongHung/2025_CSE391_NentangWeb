document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.querySelector('.my-form');
    const studentTableBody = document.querySelector('.table-column tbody');
    const submitButton = studentForm.querySelector('input[type="submit"]');

    let editingStudentId = null; // Biến để lưu trữ ID của sinh viên đang được chỉnh sửa

    // Function to add or update a student in the table
    const addOrUpdateStudentInTable = (student, isUpdate = false) => {
        if (isUpdate) {
            console.log('Attempting to update student in table:', student);
            // Find the row to update
            const rows = studentTableBody.querySelectorAll('tr');
            let rowFound = false;
            rows.forEach(row => {
                const editButtonInRow = row.querySelector('.edit-btn');
                if (editButtonInRow) { // Ensure button exists
                    const studentIdInRow = editButtonInRow.dataset.id;
                    if (studentIdInRow === student.maSinhVien) {
                        console.log('Found row to update for student:', student.maSinhVien);
                        row.cells[1].textContent = student.maSinhVien;
                        row.cells[2].textContent = student.hoVaTen;
                        row.cells[3].textContent = student.email;
                        row.cells[4].textContent = student.gioiTinh;
                        row.cells[5].textContent = student.ngaySinh;
                        rowFound = true;
                    }
                }
            });
            if (!rowFound) {
                console.warn('Could not find row to update for student ID:', student.maSinhVien);
            }
        } else {
            console.log('Attempting to add new student to table:', student);
            // Add new student
            const newRow = studentTableBody.insertRow();
            // Lấy số lượng hàng hiện tại để làm STT (bao gồm hàng vừa thêm vào DOM)
            const rowCount = studentTableBody.rows.length;

            newRow.innerHTML = `
                <td>${rowCount}</td>
                <td>${student.maSinhVien}</td>
                <td>${student.hoVaTen}</td>
                <td>${student.email}</td>
                <td>${student.gioiTinh}</td>
                <td>${student.ngaySinh}</td>
                <td>
                    <button class="edit-btn" data-id="${student.maSinhVien}"><i class="fas fa-pencil-alt">.</i></button>
                    <button class="delete-btn" data-id="${student.maSinhVien}"><i class="fas fa-trash">.</i></button>
                </td>
            `;
            console.log('New row added:', newRow);
        }
    };

    // Populate initial student data from HTML table
    const getStudentsFromTable = () => {
        const students = [];
        studentTableBody.querySelectorAll('tr').forEach(row => {
            const cells = row.cells;
            // Ensure there are enough cells before accessing them
            if (cells.length >= 6) {
                const maSinhVien = cells[1].textContent;
                const hoVaTen = cells[2].textContent;
                const email = cells[3].textContent;
                const gioiTinh = cells[4].textContent;
                const ngaySinhDisplay = cells[5].textContent; // e.g., "15/07/2025"

                // Convert DD/MM/YYYY to YYYY-MM-DD for date input
                const parts = ngaySinhDisplay.split('/'); // ["15", "07", "2025"]
                let ngaySinhForInput = '';
                if (parts.length === 3) {
                    ngaySinhForInput = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; // "2025-07-15"
                } else {
                    console.warn('Invalid date format in table row:', ngaySinhDisplay);
                }

                students.push({
                    maSinhVien,
                    hoVaTen,
                    email,
                    gioiTinh,
                    ngaySinh: ngaySinhDisplay, // for table display (DD/MM/YYYY)
                    ngaySinhForInput // for form input (YYYY-MM-DD)
                });
            } else {
                console.warn('Row has insufficient cells, skipping:', row.outerHTML);
            }
        });
        console.log('Initial studentData loaded from table:', students);
        return students;
    };

    let studentData = getStudentsFromTable(); // Initial data from table

    // Handle form submission for adding/updating a student
    studentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted.');

        const maSinhVien = document.getElementById('maSinhVien').value.trim();
        const hoVaTen = document.getElementById('hoVaTen').value.trim();
        const email = document.getElementById('email').value.trim();
        const ngaySinhInput = document.getElementById('ngaySinh').value; // YYYY-MM-DD
        const gioiTinhRadio = document.querySelector('input[name="gioiTinh"]:checked');
        const ghiChu = document.getElementById('ghiChu').value.trim();

        // Basic validation
        if (!maSinhVien || !hoVaTen || !email || !ngaySinhInput || !gioiTinhRadio) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Mã SV, Họ và tên, Email, Ngày sinh, Giới tính).');
            console.error('Validation failed: Missing required fields.');
            return;
        }

        // Format date for display in table (DD/MM/YYYY)
        const ngaySinhParts = ngaySinhInput.split('-'); // [YYYY, MM, DD]
        const ngaySinhDisplay = `${ngaySinhParts[2]}/${ngaySinhParts[1]}/${ngaySinhParts[0]}`;


        const newOrUpdatedStudent = {
            maSinhVien: maSinhVien,
            hoVaTen: hoVaTen,
            email: email,
            ngaySinh: ngaySinhDisplay, // For display in table
            gioiTinh: gioiTinhRadio.value,
            ghiChu: ghiChu // ghiChu is not displayed in table but can be stored
        };

        if (editingStudentId) {
            console.log('Currently in EDIT mode for student ID:', editingStudentId);
            // Update existing student in data array
            const index = studentData.findIndex(s => s.maSinhVien === editingStudentId);
            if (index !== -1) {
                studentData[index] = { ...newOrUpdatedStudent, ngaySinhForInput: ngaySinhInput }; // Update data in array
                addOrUpdateStudentInTable(newOrUpdatedStudent, true); // Update the table row
                alert(`Đã cập nhật sinh viên có mã: ${maSinhVien}`);
            } else {
                console.error('Error: Student not found in data array for update:', editingStudentId);
                alert('Không tìm thấy sinh viên để cập nhật.');
            }

            // Reset editing state
            editingStudentId = null;
            submitButton.value = "Thêm sinh viên"; // Change button text back
            document.getElementById('maSinhVien').readOnly = false; // Enable MSV input for new entry
        } else {
            console.log('Currently in ADD mode.');
            // Add new student
            // Check if student ID already exists
            if (studentData.some(s => s.maSinhVien === maSinhVien)) {
                alert('Mã sinh viên này đã tồn tại. Vui lòng nhập mã khác.');
                console.warn('Add failed: Student ID already exists:', maSinhVien);
                return;
            }
            studentData.push({ ...newOrUpdatedStudent, ngaySinhForInput: ngaySinhInput }); // Add to data array
            addOrUpdateStudentInTable(newOrUpdatedStudent, false); // Add new row to table
            alert(`Đã thêm sinh viên mới: ${hoVaTen}`);
        }

        // Clear form fields after submission
        studentForm.reset();
        document.getElementById('maSinhVien').readOnly = false; // Ensure MSV is editable for next add
        console.log('Form reset. Current studentData:', studentData);
    });

    // Handle click events for edit and delete buttons
    studentTableBody.addEventListener('click', (event) => {
        const target = event.target;
        const button = target.closest('button');

        if (button) {
            const studentId = button.dataset.id; // Get the student ID from data-id attribute
            console.log('Button clicked. data-id:', studentId);

            if (button.classList.contains('edit-btn')) {
                console.log('Edit button clicked for student ID:', studentId);
                // Set editing state
                editingStudentId = studentId;
                submitButton.value = "Cập nhật sinh viên"; // Change button text

                // Find the student in our data array
                const studentToEdit = studentData.find(s => s.maSinhVien === studentId);
                console.log('Student data found for editing:', studentToEdit);

                if (studentToEdit) {
                    // Populate the form with student data
                    document.getElementById('maSinhVien').value = studentToEdit.maSinhVien;
                    document.getElementById('maSinhVien').readOnly = true; // Make MSV read-only during edit
                    document.getElementById('hoVaTen').value = studentToEdit.hoVaTen;
                    document.getElementById('email').value = studentToEdit.email;

                    // Populate date input (expects YYYY-MM-DD)
                    document.getElementById('ngaySinh').value = studentToEdit.ngaySinhForInput;
                    console.log('Date input value set to:', studentToEdit.ngaySinhForInput);

                    // Set gender radio button
                    const genderRadios = document.querySelectorAll('input[name="gioiTinh"]');
                    genderRadios.forEach(radio => {
                        if (radio.value === studentToEdit.gioiTinh) {
                            radio.checked = true;
                            console.log('Gender radio checked:', radio.value);
                        } else {
                            radio.checked = false; // Ensure others are unchecked
                        }
                    });

                    // If you want to handle ghiChu for edit, ensure it's stored in studentData
                    // document.getElementById('ghiChu').value = studentToEdit.ghiChu || '';
                } else {
                    console.error('Error: Student data not found in array for editing:', studentId);
                    alert('Không tìm thấy dữ liệu sinh viên để chỉnh sửa.');
                    // Reset to add mode if student not found
                    editingStudentId = null;
                    submitButton.value = "Thêm sinh viên";
                    studentForm.reset();
                    document.getElementById('maSinhVien').readOnly = false;
                }

            } else if (button.classList.contains('delete-btn')) {
                console.log('Delete button clicked for student ID:', studentId);
                // Delete functionality
                if (confirm(`Bạn có chắc chắn muốn xóa sinh viên có mã: ${studentId} không?`)) {
                    // Remove from data array
                    const initialLength = studentData.length;
                    studentData = studentData.filter(s => s.maSinhVien !== studentId);
                    if (studentData.length < initialLength) {
                        console.log('Student removed from data array:', studentId);
                    } else {
                        console.warn('Student not found in data array for deletion:', studentId);
                    }

                    // Remove from table (DOM)
                    const row = button.closest('tr');
                    if (row) {
                        row.remove();
                        alert(`Đã xóa sinh viên có mã: ${studentId}`);
                        updateRowNumbers(); // Update STT after deletion
                    } else {
                        console.error('Could not find row to delete for student ID:', studentId);
                    }


                    // If the deleted student was the one being edited, reset the form
                    if (editingStudentId === studentId) {
                        console.log('Deleted student was being edited, resetting form.');
                        editingStudentId = null;
                        submitButton.value = "Thêm sinh viên";
                        studentForm.reset();
                        document.getElementById('maSinhVien').readOnly = false;
                    }
                }
            }
        }
    });

    // Function to update STT (sequential numbers) after deletion
    const updateRowNumbers = () => {
        const rows = studentTableBody.querySelectorAll('tr');
        console.log('Updating row numbers. Total rows:', rows.length);
        rows.forEach((row, index) => {
            if (row.cells[0]) { // Ensure the cell exists
                 row.cells[0].textContent = index + 1;
            }
        });
    };
});