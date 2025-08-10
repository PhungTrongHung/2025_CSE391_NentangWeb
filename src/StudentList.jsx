import React from 'react';

function StudentList({ students, onEdit, onDelete }) {
  return (
    <div>
      <h2>Danh sách Sinh viên</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>STT</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mã SV</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Họ tên</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Giới tính</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ngày sinh</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.studentId}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.fullName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.gender}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.birthDate}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => onEdit(student)}
                  style={{
                    marginRight: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(student.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;