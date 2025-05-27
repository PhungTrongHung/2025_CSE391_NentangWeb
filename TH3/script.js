let tasks = []; // Danh sách công việc
let currentFilter = "all"; // Trạng thái lọc: all | active | done

// Thêm công việc mới
function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (text === "") { // Kiểm tra trống/null
    alert("Vui lòng nhập nội dung công việc!");
    return;
  }

  const task = {
    id: Date.now(), // ID duy nhất
    text: text,
    isDone: false // Mặc định chưa hoàn thành
  };

  tasks.push(task);
  input.value = ""; // Reset ô input
  saveTasksToLocalStorage(); // Cập nhật localStorage
  renderTasks(); // Cập nhật lại giao diện
}

// Hiển thị danh sách công việc
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
// Lọc theo trạng thái
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "active") return !task.isDone;
    if (currentFilter === "done") return task.isDone;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (task.isDone) {
      span.classList.add("completed");
    }
    // Sự kiện đánh dấu hoàn thành
    span.onclick = () => toggleTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Đánh dấu hoàn thành
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, isDone: !task.isDone } : task
  );
  saveTasksToLocalStorage();
  renderTasks();
}

// Xóa công việc
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
}

// Lọc công việc theo trạng thái
function filterTasks(status) {
  currentFilter = status;
  renderTasks();
}

// Lưu vào LocalStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Tải từ LocalStorage
function loadTasksFromLocalStorage() {
  const data = localStorage.getItem("todoTasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  renderTasks();
}

// Tự động tải lại danh sách công việc mà không mất dữ liệu.
window.onload = loadTasksFromLocalStorage;