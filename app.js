// ==========================================
// STATE MANAGEMENT
// ==========================================
// Load tasks from localStorage if they exist, otherwise start with an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ==========================================
// DOM ELEMENTS
// ==========================================
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');
const filtersContainer = document.getElementById('filters');

// ==========================================
// CORE LOGIC & CRUD OPERATIONS
// ==========================================

// Save the current state of 'tasks' to the browser's local storage
function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Read and Render the UI based on state
function renderTasks() {
  // Clear the existing list before rebuilding
  todoList.innerHTML = '';

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // fallback for 'all'
  });

  // Dynamically create and append DOM elements for each task
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    // Store the unique task ID on the list item for event delegation
    li.dataset.id = task.id; 

    li.innerHTML = `
      <label>
        <input type="checkbox" class="toggle-cb" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
      </label>
      <button class="delete-btn">Delete</button>
    `;
    
    todoList.appendChild(li);
  });
}

// Create a new task
function addTask(text) {
  const newTask = {
    id: Date.now().toString(), // Use timestamp for a simple unique ID
    text: text,
    completed: false
  };
  tasks.push(newTask);
  saveAndRender();
}

// Update a task's completion status
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveAndRender();
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

// Helper function to bundle saving and rendering
function saveAndRender() {
  saveToStorage();
  renderTasks();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Handle form submission (Adding a task)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the page from reloading
  const text = taskInput.value.trim();
  if (text !== '') {
    addTask(text);
    taskInput.value = ''; // Clear input field after adding
  }
});

// Event Delegation: Handle clicks on dynamically created list items
todoList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  
  const taskId = li.dataset.id;

  // Handle delete button click
  if (e.target.classList.contains('delete-btn')) {
    deleteTask(taskId);
  }
  
  // Handle checkbox toggle
  if (e.target.classList.contains('toggle-cb')) {
    toggleTask(taskId);
  }
});

// Handle filter button clicks
filtersContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    // Update active UI styling
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update state and re-render
    currentFilter = e.target.dataset.filter;
    renderTasks();
  }
});

// ==========================================
// INITIALIZATION
// ==========================================
// Render the application when the script first loads
renderTasks();
