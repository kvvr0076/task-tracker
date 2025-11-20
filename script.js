// Task Tracker App (no external deps other than FontAwesome & AdSense)
class TaskTracker {
  constructor() {
    this.tasks = this.safeParse(localStorage.getItem('tasks')) || [];
    this.currentFilter = 'all';
    this.cacheDom();
    this.init();
  }

  safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
  }

  cacheDom() {
    this.taskForm = document.getElementById('taskForm');
    this.taskInput = document.getElementById('taskInput');
    this.taskPriority = document.getElementById('taskPriority');
    this.tasksContainer = document.getElementById('tasksContainer');

    this.totalTasksEl = document.getElementById('totalTasks');
    this.activeTasksEl = document.getElementById('activeTasks');
    this.completedTasksEl = document.getElementById('completedTasks');
    this.completionRateEl = document.getElementById('completionRate');

    this.notification = document.getElementById('notification');
    this.notificationText = document.getElementById('notificationText');

    // Edit modal elements
    this.editModal = document.getElementById('editModal');
    this.editInput = document.getElementById('editInput');
    this.editSaveBtn = document.getElementById('editSaveBtn');
    this.editCancelBtn = document.getElementById('editCancelBtn');
  }

  init() {
    this.setupEventListeners();
    this.renderTasks();
    this.updateStats();
    this.setupEditModal();
  }

  setupEventListeners() {
    // Add task
    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderTasks();
      });
    });

    // Global error listener (AdSense dev noise)
    window.addEventListener('error', (e) => {
      if (e?.message?.includes('adsbygoogle')) {
        console.log('AdSense loading error - common during local/dev preview');
      }
    });

    // On load try push ads (standard AdSense init)
    window.addEventListener('load', () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log('AdSense initialization error:', e);
      }
    });
  }

  setupEditModal() {
    // Close modal on cancel
    this.editCancelBtn.addEventListener('click', () => {
      this.closeEditModal();
    });

    // Close modal on background click
    this.editModal.addEventListener('click', (e) => {
      if (e.target === this.editModal) {
        this.closeEditModal();
      }
    });

    // Save on Enter key
    this.editInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveEdit();
      }
    });

    // Save on button click
    this.editSaveBtn.addEventListener('click', () => {
      this.saveEdit();
    });
  }

  openEditModal(taskId, currentText) {
    this.editingTaskId = taskId;
    this.editInput.value = currentText;
    this.editModal.classList.add('show');
    // Focus and select text for easy editing
    setTimeout(() => {
      this.editInput.focus();
      this.editInput.select();
    }, 100);
  }

  closeEditModal() {
    this.editModal.classList.remove('show');
    this.editInput.value = '';
    this.editingTaskId = null;
  }

  saveEdit() {
    const newText = this.editInput.value.trim();
    if (!newText) {
      this.closeEditModal();
      return;
    }

    const task = this.tasks.find(t => t.id === this.editingTaskId);
    if (task) {
      task.text = newText;
      this.saveTasks();
      this.renderTasks();
      this.showNotification('Task updated!', 'success');
    }

    this.closeEditModal();
  }

  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.openEditModal(id, task.text);
  }

  addTask() {
    const text = (this.taskInput.value || '').trim();
    const priority = this.taskPriority.value;

    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();

    // Reset form
    this.taskInput.value = '';
    this.taskPriority.value = 'medium';

    // Show toast
    this.showNotification('Task added successfully!', 'success');
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    this.saveTasks();
    this.renderTasks();
    this.updateStats();

    const msg = task.completed ? 'Task marked as completed!' : 'Task marked as active!';
    this.showNotification(msg, 'success');
  }

  deleteTask(id) {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length === before) return;

    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.showNotification('Task deleted!', 'success');
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(t => !t.completed);
      case 'completed':
        return this.tasks.filter(t => t.completed);
      case 'high':
        return this.tasks.filter(t => t.priority === 'high');
      case 'medium':
        return this.tasks.filter(t => t.priority === 'medium');
      case 'low':
        return this.tasks.filter(t => t.priority === 'low');
      default:
        return this.tasks;
    }
  }

  renderTasks() {
    const filtered = this.getFilteredTasks();

    if (filtered.length === 0) {
      this.tasksContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>No tasks found. Try changing the filter or add a new task!</p>
        </div>`;
      return;
    }

    // Build items
    const html = filtered.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}">
        <input
          type="checkbox"
          class="task-checkbox"
          ${task.completed ? 'checked' : ''}
          onchange="window.taskTracker.toggleTask(${task.id})"
          aria-label="Toggle task"
        >
        <div class="task-content">
          <div class="task-text">${this.escapeHtml(task.text)}</div>
          <div class="task-meta">
            <span class="task-priority-badge priority-${this.escapeHtml(task.priority)}">
              ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span>${this.formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn edit" onclick="window.taskTracker.editTask(${task.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="window.taskTracker.deleteTask(${task.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    this.tasksContainer.innerHTML = html;
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.totalTasksEl.textContent = total.toString();
    this.activeTasksEl.textContent = active.toString();
    this.completedTasksEl.textContent = completed.toString();
    this.completionRateEl.textContent = `${rate}%`;
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const diffDays = Math.floor(diffTime / day);
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / hour);
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / minute);
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  showNotification(message, type = 'success') {
    if (!this.notification || !this.notificationText) return;

    const icon = this.notification.querySelector('i');
    this.notificationText.textContent = message;
    this.notification.className = `notification ${type} show`;

    if (icon) {
      icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }

    clearTimeout(this._notifTimer);
    this._notifTimer = setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }
}

// Initialize after DOM ready (script loaded at end of body, but safe-guard)
(function initApp() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.taskTracker = new TaskTracker();
    });
  } else {
    window.taskTracker = new TaskTracker();
  }
})();
