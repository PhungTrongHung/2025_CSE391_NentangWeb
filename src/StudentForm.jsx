import React, { useState, useEffect } from 'react';

function StudentForm({ onAdd, onUpdate, onCancel, editingStudent }) {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    gender: 'Nam',
    birthDate: '',
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    } else {
      setFormData({ studentId: '', fullName: '', email: '', gender: 'Nam', birthDate: '' });
    }
  }, [editingStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.fullName || !formData.email || !formData.birthDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (editingStudent) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h2>{editingStudent ? 'Cập nhật Sinh viên' : 'Thêm Sinh viên'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mã SV:</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="Nhập mã sinh viên"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Họ tên:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="Nhập họ tên"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="Nhập email"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Giới tính:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Ngày sinh:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {editingStudent ? 'Cập nhật' : 'Thêm'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
