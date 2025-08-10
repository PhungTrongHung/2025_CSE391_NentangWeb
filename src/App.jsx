import React, { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import studentsData from './data';

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('Dữ liệu từ data.js:', studentsData); // Debug dữ liệu từ data.js
    // Khởi tạo state với dữ liệu từ data.js
    setStudents(studentsData);
    // Lưu dữ liệu khởi tạo vào localStorage
    localStorage.setItem('students', JSON.stringify(studentsData));
  }, []);

  useEffect(() => {
    // Lưu thay đổi vào localStorage khi students thay đổi
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (newStudent) => {
    const studentWithId = { ...newStudent, id: Date.now() };
    setStudents([...students, studentWithId]);
    setIsModalOpen(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    const newList = students.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    setStudents(newList);
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id) => {
    const newList = students.filter((s) => s.id !== id);
    setStudents(newList);
  };

  const openModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Quản Lý Sinh Viên</h1>
      <button
        onClick={openModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Thêm Sinh viên
      </button>
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '5px',
              width: '400px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <StudentForm
              onAdd={handleAddStudent}
              onUpdate={handleUpdateStudent}
              onCancel={handleCancelEdit}
              editingStudent={editingStudent}
            />
          </div>
        </div>
      )}
      <StudentList
        students={students}
        onEdit={handleEditClick}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}

export default App;
