```vue
<template>
  <div class="app-container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet">
    <!-- Loading screen while checking authentication -->
    <div v-if="authLoading" class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>Loading...</p>
    </div>

    <!-- Main app content -->
    <div v-else>
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <h1>System Maintenance Calendar</h1>
        </div>
        <div class="header-right">
          <div class="time-display">{{ currentTime }}</div>
          <div class="user-display" v-if="user">
            <span>{{ user.email }}</span>
          </div>
        </div>
      </header>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="sidebar-logo">🌿</div>
          <h2>VermiTech</h2>
        </div>
        <nav class="sidebar-nav">
          <router-link to="/overview" class="nav-item">
            <i class="fas fa-tachometer-alt"></i>
            <span class="nav-text">Overview</span>
          </router-link>
          <router-link to="/scheduling" class="nav-item">
            <i class="fas fa-calendar-alt"></i>
            <span class="nav-text">Scheduling</span>
          </router-link>
         
          <router-link to="/register" class="nav-item">
            <i class="fas fa-user-plus"></i>
            <span class="nav-text">Register Admin</span>
          </router-link>
          <router-link to="/logout" class="nav-item logout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-text">Logout</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content" :class="{ 'content-expanded': sidebarCollapsed }">
        <div class="scheduling-content">
          <!-- Top Action Bar -->
          <div class="action-bar">
            <button class="btn btn-primary" @click="showTaskModal = true">
              <i class="fas fa-plus"></i> Add New Task
            </button>
            <div class="view-controls">
              <button 
                class="btn btn-outline" 
                :class="{ active: currentView === 'calendar' }"
                @click="currentView = 'calendar'"
              >
                <i class="fas fa-calendar"></i> Calendar
              </button>
              <button 
                class="btn btn-outline" 
                :class="{ active: currentView === 'list' }"
                @click="currentView = 'list'"
              >
                <i class="fas fa-list"></i> List
              </button>
            </div>
            <div class="filter-controls">
              <select v-model="filterType" class="filter-select">
                <option value="">All Types</option>
                <option value="feeding">Feeding</option>
                <option value="maintenance">Maintenance</option>
                <option value="harvest">Harvest</option>
                <option value="monitoring">Monitoring</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
          </div>

          <!-- Calendar View -->
          <div v-if="currentView === 'calendar'" class="calendar-container">
            <div class="calendar-header">
              <button class="nav-btn" @click="previousMonth">
                <i class="fas fa-chevron-left"></i>
              </button>
              <h2>{{ monthYearDisplay }}</h2>
              <button class="nav-btn" @click="nextMonth">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="calendar-grid">
              <div class="calendar-weekdays">
                <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
              </div>
              <div class="calendar-days">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date"
                  class="calendar-day"
                  :class="{ 
                    'other-month': !day.currentMonth,
                    'today': day.isToday,
                    'has-tasks': day.tasks.length > 0
                  }"
                  @click="openTaskModalForDate(day.date)"
                >
                  <div class="day-number">{{ day.day }}</div>
                  <div class="day-tasks">
                    <div 
                      v-for="task in day.tasks.slice(0, 3)" 
                      :key="task.id"
                      class="task-item"
                      :class="task.type"
                      @click.stop="editTask(task)"
                    >
                      <span class="task-type-label" :class="task.type">{{ task.type | capitalize }}</span>
                      <span class="task-title">{{ task.title }}</span>
                      <span class="task-time">{{ formatTime(task.time) }}</span>
                    </div>
                    <div v-if="day.tasks.length > 3" class="more-tasks">
                      +{{ day.tasks.length - 3 }} more
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Task History Table -->
            <div class="task-history">
              <h3>Task History</h3>
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Created At</th>
                    <th>Completed At</th>
                    <th>Delayed To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in taskHistory" :key="task.id" :class="task.type">
                    <td>{{ task.title }}</td>
                    <td>
                      <span class="task-type-label" :class="task.type">{{ task.type | capitalize }}</span>
                    </td>
                    <td>{{ formatDateTime(task.createdAt) }}</td>
                    <td>{{ task.completedAt ? formatDateTime(task.completedAt) : '-' }}</td>
                    <td>{{ task.delayedTo ? formatDate(task.delayedTo) : '-' }}</td>
                    <td>
                      <button v-if="!task.completedAt" class="btn-icon" @click="editTask(task)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button v-if="!task.completedAt" class="btn-icon" @click="completeTask(task.id)" title="Complete">
                        <i class="fas fa-check"></i>
                      </button>
                      <button v-if="!task.completedAt" class="btn-icon" @click="delayTask(task.id)" title="Delay">
                        <i class="fas fa-clock"></i>
                      </button>
                      <button class="btn-icon" @click="deleteTask(task.id)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- List View -->
          <div v-if="currentView === 'list'" class="list-container">
            <div class="task-list">
              <div class="list-header">
                <h3>Upcoming Tasks</h3>
                <div class="sort-controls">
                  <select v-model="sortBy" class="sort-select">
                    <option value="date">Sort by Date</option>
                    <option value="type">Sort by Type</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                </div>
              </div>
              
              <div class="task-groups">
                <div v-for="group in groupedTasks" :key="group.title" class="task-group">
                  <h4 class="group-title">{{ group.title }}</h4>
                  <div class="group-tasks">
                    <div 
                      v-for="task in group.tasks" 
                      :key="task.id"
                      class="task-card"
                      :class="task.type"
                    >
                      <div class="task-header">
                        <div class="task-info">
                          <h5 class="task-title">{{ task.title }}</h5>
                          <p class="task-description">{{ task.description }}</p>
                        </div>
                        <div class="task-actions">
                          <button class="btn-icon" @click="editTask(task)" title="Edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn-icon" @click="deleteTask(task.id)" title="Delete">
                            <i class="fas fa-trash"></i>
                          </button>
                          <button class="btn-icon" @click="completeTask(task.id)" title="Complete">
                            <i class="fas fa-check"></i>
                          </button>
                        </div>
                      </div>
                      <div class="task-details">
                        <span class="task-date">
                          <i class="fas fa-calendar"></i>
                          {{ formatDate(task.date) }}
                        </span>
                        <span class="task-time">
                          <i class="fas fa-clock"></i>
                          {{ formatTime(task.time) }}
                        </span>
                        <span class="task-assignee" v-if="task.assignedTo">
                          <i class="fas fa-user"></i>
                          {{ task.assignedTo }}
                        </span>
                        <span class="task-recurrence" v-if="task.recurrence && task.recurrence !== 'none'">
                          <i class="fas fa-redo"></i>
                          {{ task.recurrence }}
                        </span>
                        <span class="task-type-label" :class="task.type">{{ task.type | capitalize }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Modal -->
          <div v-if="showTaskModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <form @submit.prevent="saveTask" class="task-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="taskTitle">Task Title</label>
                    <input 
                      type="text" 
                      id="taskTitle"
                      v-model="taskForm.title" 
                      required
                      placeholder="Enter task title"
                    />
                  </div>
                  <div class="form-group">
                    <label>Task Type:</label>
                    <select v-model="taskForm.type">
                      <option value="feeding">Feeding</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="harvest">Harvest</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="taskDescription">Description</label>
                  <textarea 
                    id="taskDescription"
                    v-model="taskForm.description" 
                    placeholder="Enter task description"
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="taskDate">Date</label>
                    <input 
                      type="date" 
                      id="taskDate"
                      v-model="taskForm.date" 
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="taskTime">Time</label>
                    <input 
                      type="time" 
                      id="taskTime"
                      v-model="taskForm.time" 
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Assign To:</label>
                  <span>Admin</span> <!-- Display as label instead of input -->
                </div>

                <div class="form-group">
                  <label for="taskRecurrence">Recurrence</label>
                  <select id="taskRecurrence" v-model="taskForm.recurrence">
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Interval</option>
                  </select>
                </div>

                <div v-if="taskForm.recurrence === 'custom'" class="form-group">
                  <label for="customInterval">Custom Interval (days)</label>
                  <input 
                    type="number" 
                    id="customInterval"
                    v-model="taskForm.customInterval" 
                    min="1"
                    placeholder="Enter number of days"
                  />
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="closeModal">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">
                    {{ editingTask ? 'Update Task' : 'Create Task' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Reminder Notifications -->
          <div v-if="showReminders" class="reminder-panel">
            <h4>Upcoming Reminders</h4>
            <div class="reminder-list">
              <div 
                v-for="reminder in upcomingReminders" 
                :key="reminder.id"
                class="reminder-item"
                :class="reminder.urgency"
              >
                <div class="reminder-content">
                  <h5>{{ reminder.title }}</h5>
                  <p>{{ reminder.message }}</p>
                  <span class="reminder-time">{{ reminder.timeToTask }}</span>
                </div>
                <button class="btn-icon" @click="dismissReminder(reminder.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  onSnapshot 
} from 'firebase/firestore';
import Swal from 'sweetalert2';

export default {
  name: 'Scheduling',
  data() {
    return {
      authLoading: true,
      user: null,
      sidebarCollapsed: false,
      currentTime: '',
      showTaskModal: false,
      editingTask: null,
      currentView: 'calendar',
      filterType: '',
      sortBy: 'date',
      showReminders: true,
      currentDate: new Date(),
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      taskForm: {
        title: '',
        description: '',
        type: '',
        date: '',
        time: '',
        assignedTo: '',
        recurrence: 'none',
        customInterval: null,
        status: 'pending',
        completedAt: null,
        delayedTo: null
      },
      tasks: [],
      dismissedReminders: new Set()
    };
  },
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  computed: {
    monthYearDisplay() {
      return this.currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric'
      });
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = this.filteredTasks.filter(task => task.date === dateStr);
        
        days.push({
          date: dateStr,
          day: date.getDate(),
          currentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          tasks: dayTasks
        });
      }
      
      return days;
    },
    filteredTasks() {
      let filtered = this.tasks.filter(task => task.status === 'pending' || task.status === 'delayed');
      if (this.filterType) {
        filtered = filtered.filter(task => task.type === this.filterType);
      }
      if (this.sortBy === 'type') {
        filtered = filtered.sort((a, b) => a.type.localeCompare(b.type));
      } else if (this.sortBy === 'priority') {
        filtered = filtered.sort((a, b) => (b.priority || '').localeCompare(a.priority || ''));
      } else {
        filtered = filtered.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
      }
      return filtered;
    },
    taskHistory() {
      let history = this.tasks;
      if (this.filterType) {
        history = history.filter(task => task.type === this.filterType);
      }
      return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    groupedTasks() {
      const groups = [];
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayTasks = this.filteredTasks.filter(task => 
        task.date === today.toISOString().split('T')[0]
      );
      
      const tomorrowTasks = this.filteredTasks.filter(task => 
        task.date === tomorrow.toISOString().split('T')[0]
      );
      
      const upcomingTasks = this.filteredTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate > tomorrow;
      });
      
      if (todayTasks.length > 0) {
        groups.push({ title: 'Today', tasks: todayTasks });
      }
      
      if (tomorrowTasks.length > 0) {
        groups.push({ title: 'Tomorrow', tasks: tomorrowTasks });
      }
      
      if (upcomingTasks.length > 0) {
        groups.push({ title: 'Upcoming', tasks: upcomingTasks });
      }
      
      return groups;
    },
    upcomingReminders() {
      const now = new Date();
      const reminders = [];
      
      this.filteredTasks.forEach(task => {
        if (this.dismissedReminders.has(task.id)) return;
        
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const timeDiff = taskDateTime - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff > 0 && hoursDiff <= 24) {
          let urgency = 'due';
          let timeToTask = '';
          
          if (hoursDiff <= 1) {
            urgency = 'urgent';
            timeToTask = `${Math.round(timeDiff / (1000 * 60))} minutes`;
          } else if (hoursDiff <= 6) {
            urgency = 'high';
            timeToTask = `${Math.round(hoursDiff)} hours`;
          } else {
            timeToTask = `${Math.round(hoursDiff)} hours`;
          }
          
          reminders.push({
            id: task.id,
            title: task.title,
            message: `Scheduled for ${this.formatTime(task.time)}`,
            timeToTask: `In ${timeToTask}`,
            urgency
          });
        }
      });
      return reminders.slice(0, 5);
    }
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    setInterval(this.checkReminders, 60000);
    
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.authLoading = false;
      if (user) {
        this.loadTasks();
      }
    });
    
    this.taskForm.date = new Date().toISOString().split('T')[0];
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    previousMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.currentDate = new Date(this.currentDate);
    },
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentDate = new Date(this.currentDate);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    formatTime(timeStr) {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    },
    async loadTasks() {
      try {
        const tasksCollection = collection(db, 'tasks');
        onSnapshot(tasksCollection, (snapshot) => {
          this.tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('Tasks loaded:', this.tasks);
        });
      } catch (error) {
        console.error('Error loading tasks:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load tasks: ' + error.message,
        });
      }
    },
    async saveTask() {
      try {
        console.log('Saving task with editingTask:', this.editingTask);
        console.log('Task form data:', this.taskForm);
        const taskData = {
          ...this.taskForm,
          status: 'pending',
          completedAt: null,
          delayedTo: null,
          createdBy: this.user.uid,
          createdAt: new Date().toISOString()
        };
        console.log('Task data to save:', taskData);

        if (this.editingTask) {
          console.log('Updating task with ID:', this.editingTask.id);
          const taskRef = doc(db, 'tasks', this.editingTask.id);
          const taskSnap = await getDoc(taskRef);
          if (!taskSnap.exists()) {
            console.error('Task document does not exist:', this.editingTask.id);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Task not found. It may have been deleted.',
            });
            this.closeModal();
            return;
          }
          await updateDoc(taskRef, taskData);
          console.log('Task updated successfully');
          Swal.fire({
            icon: 'success',
            title: 'Task Updated',
            text: 'Task has been successfully updated!',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          console.log('Creating new task');
          await addDoc(collection(db, 'tasks'), taskData);
          console.log('Task created successfully');
          Swal.fire({
            icon: 'success',
            title: 'Task Created',
            text: 'Task has been successfully created!',
            timer: 1500,
            showConfirmButton: false
          });
        }
        this.closeModal();
      } catch (error) {
        console.error('Error saving task:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to save task: ${error.message}`,
        });
      }
    },
    async completeTask(taskId) {
      try {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
          console.error('Task not found in local state:', taskId);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Task not found.',
          });
          return;
        }

        const completedAt = new Date().toISOString();
        const taskRef = doc(db, 'tasks', taskId);
        
        await updateDoc(taskRef, {
          completedAt: completedAt
        });

        // Update the local task data
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].completedAt = completedAt;
        }

        Swal.fire({
          icon: 'success',
          title: 'Task Completed',
          text: 'Task marked as completed!',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error completing task:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to complete task: ${error.message}`,
        });
      }
    },
    async delayTask(taskId) {
      try {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
          console.error('Task not found in local state:', taskId);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Task not found.',
          });
          return;
        }

        const { value: newDate } = await Swal.fire({
          title: 'Delay Task',
          text: 'Select new date for the task:',
          input: 'date',
          inputValue: task.date,
          showCancelButton: true,
          confirmButtonText: 'Delay',
          cancelButtonText: 'Cancel'
        });

        if (newDate) {
          const taskRef = doc(db, 'tasks', taskId);
          await updateDoc(taskRef, { 
            date: newDate,
            delayedTo: newDate
          });

          // Update the local task data
          const taskIndex = this.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            this.tasks[taskIndex].date = newDate;
            this.tasks[taskIndex].delayedTo = newDate;
          }

          Swal.fire({
            icon: 'success',
            title: 'Task Delayed',
            text: `Task has been delayed to ${this.formatDate(newDate)}!`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error delaying task:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to delay task: ${error.message}`,
        });
      }
    },
    async deleteTask(taskId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this task?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log('Deleting task with ID:', taskId);
            const taskRef = doc(db, 'tasks', taskId);
            const taskSnap = await getDoc(taskRef);
            if (!taskSnap.exists()) {
              console.error('Task document does not exist:', taskId);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Task not found. It may have already been deleted.',
              });
              this.tasks = this.tasks.filter(task => task.id !== taskId);
              return;
            }
            await deleteDoc(taskRef);
            console.log('Task deleted successfully from Firestore:', taskId);
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Task has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error deleting task:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Failed to delete task: ${error.message}`,
            });
          }
        }
      });
    },
    checkReminders() {
      this.upcomingReminders.forEach(reminder => {
        if (!this.dismissedReminders.has(reminder.id)) {
          console.log('Showing reminder:', reminder);
          Swal.fire({
            title: reminder.title,
            text: `${reminder.message} (${reminder.timeToTask})`,
            icon: reminder.urgency === 'urgent' ? 'error' : reminder.urgency === 'high' ? 'warning' : 'info',
            confirmButtonText: 'Dismiss',
            timer: 5000,
            timerProgressBar: true
          }).then((result) => {
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
              this.dismissReminder(reminder.id);
            }
          });
        }
      });
    },
    dismissReminder(reminderId) {
      console.log('Dismissing reminder with ID:', reminderId);
      this.dismissedReminders.add(reminderId);
      setTimeout(() => {
        this.dismissedReminders.delete(reminderId);
        console.log('Cleared dismissed reminder:', reminderId);
      }, 24 * 60 * 60 * 1000);
    },
    editTask(task) {
      if (!task || !task.id) {
        console.error('Invalid task or missing ID:', task);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid task selected for editing.',
        });
        return;
      }
      console.log('Editing task:', task);
      this.editingTask = task;
      this.taskForm = { ...task };
      this.showTaskModal = true;
    },
    openTaskModalForDate(date) {
      console.log('Calendar day clicked, opening task modal for date:', date);
      if (!date || typeof date !== 'string') {
        console.error('Invalid date provided:', date);
        return;
      }
      this.editingTask = null;
      this.resetForm();
      this.taskForm.date = date;
      this.showTaskModal = true;
      console.log('Modal state:', { showTaskModal: this.showTaskModal, taskFormDate: this.taskForm.date });
    },
    closeModal() {
      console.log('Closing modal');
      this.showTaskModal = false;
      this.editingTask = null;
      this.resetForm();
    },
    resetForm() {
      console.log('Resetting task form');
      this.taskForm = {
        title: '',
        description: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        assignedTo: 'admin', // Automatically set to admin
        recurrence: 'none',
        customInterval: null,
        status: 'pending',
        completedAt: null,
        delayedTo: null
      };
    }
  }
};
</script>

<style scoped>
/* Base Styles */
:root {
  --primary-color: #27AE60; /* Emerald Green */
  --secondary-color: #219653; /* Darker Green */
  --accent-color: #2ECC71; /* Lime Green */
  --danger-color: #FF6B6B; /* Coral Red */
  --warning-color: #F4A261; /* Sandy Orange */
  --success-color: #2ECC71; /* Lime Green */
  --dark-color: #1A3C34; /* Deep Forest Green */
  --light-color: #F0F7F4; /* Light Mint */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;
  /* Task type colors */
  --feeding-color: #4CAF50; /* Green */
  --maintenance-color: #FF9800; /* Orange */
  --harvest-color: #9C27B0; /* Purple */
  --monitoring-color: #2196F3; /* Blue */
  --cleaning-color: #607D8B; /* Gray */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  background-color: var(--light-color);
}

/* Loading Screen Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.loading-spinner {
  font-size: 3.5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  animation: spin 1s linear infinite;
}

.loading-container p {
  font-size: 1.3rem;
  color: var(--dark-color);
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  background: linear-gradient(180deg, #FFFFFF, var(--light-color));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0 25px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h1 {
  font-size: 1.8rem;
  color: var(--dark-color);
  font-weight: 600;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--dark-color);
  padding: 8px;
  transition: transform 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.time-display {
  font-size: 1.1rem;
  color: var(--dark-color);
  font-weight: 500;
}

.user-display {
  font-size: 1rem;
  color: var(--dark-color);
  font-weight: 500;
  padding: 8px 12px;
  background: var(--light-color);
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--dark-color), #1E4D43);
  color: white;
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  transition: width 0.3s ease, transform 0.3s ease;
  z-index: 90;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.sidebar-logo {
  font-size: 2.5rem;
  color: var(--accent-color);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: var(--accent-color);
}

.nav-item i {
  font-size: 1.4rem;
  margin-right: 15px;
  width: 24px;
  text-align: center;
}

.nav-item.router-link-exact-active {
  background: var(--primary-color);
  color: white;
  border-left-color: var(--accent-color);
}

.nav-item.logout {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.7);
}

.nav-item.logout:hover {
  color: white;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-collapsed .sidebar-header h2 {
  display: none;
}

.sidebar-collapsed .sidebar-logo {
  font-size: 2rem;
  margin: 0 auto;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 15px 0;
}

.sidebar-collapsed .nav-item i {
  margin-right: 0;
  font-size: 1.6rem;
}

/* Main Content */
.main-content {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  padding: 30px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - var(--header-height));
}

.content-expanded {
  margin-left: var(--sidebar-collapsed-width);
}

.scheduling-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.view-controls {
  display: flex;
  gap: 10px;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: var(--dark-color);
  border: 1px solid #A3BFFA;
}

.btn-outline.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-icon {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #588157;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #f0f0f0;
  color: var(--primary-color);
}

/* Select Inputs */
.filter-select,
.sort-select {
  padding: 10px;
  border: 1px solid #A3BFFA;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--dark-color);
  background: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:hover,
.sort-select:hover {
  border-color: var(--primary-color);
}

/* Calendar Styles */
.calendar-container {
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.calendar-grid {
  padding: 20px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 10px;
}

.weekday {
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: var(--dark-color);
  background-color: var(--light-color);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  min-height: 120px;
  padding: 8px;
  background-color: #FFFFFF;
  border: 1px solid #E6E6FA;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.calendar-day:hover {
  background-color: var(--light-color);
}

.calendar-day.other-month {
  color: #A3BFFA;
  background-color: #F8F9FA;
}

.calendar-day.today {
  background-color: #E3F2FD;
  border-color: var(--primary-color);
}

.calendar-day.has-tasks {
  border-left: 4px solid var(--accent-color);
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.day-tasks {
  font-size: 0.75rem;
  color: black;
}

.task-item {
  padding: 4px 6px;
  margin-bottom: 4px;
  border-radius: 4px;
  color: black;
  font-size: 0.7rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.task-item:hover {
  opacity: 0.9;
}

.task-item.feeding {
  background-color: var(--feeding-color);
}

.task-item.maintenance {
  background-color: var(--maintenance-color);
}

.task-item.harvest {
  background-color: var(--harvest-color);
}

.task-item.monitoring {
  background-color: var(--monitoring-color);
}

.task-item.cleaning {
  background-color: var(--cleaning-color);
}

.task-type-label {
  display: inline-block;
  padding: 2px 6px;
  margin-bottom: 3px;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 500;
  color: #fff;
}

.task-type-label.feeding {
  background-color: var(--feeding-color);
}

.task-type-label.maintenance {
  background-color: var(--maintenance-color);
}

.task-type-label.harvest {
  background-color: var(--harvest-color);
}

.task-type-label.monitoring {
  background-color: var(--monitoring-color);
}

.task-type-label.cleaning {
  background-color: var(--cleaning-color);
}

.task-title {
  display: block;
  font-weight: 500;
}

.task-time {
  font-size: 0.6rem;
  opacity: 0.9;
}

.more-tasks {
  color: #588157;
  font-size: 0.6rem;
  margin-top: 2px;
}

/* Task History Table */
.task-history {
  margin-top: 20px;
  padding: 25px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.task-history h3 {
  color: var(--dark-color);
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
}

.history-table th,
.history-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #E6E6FA;
}

.history-table th {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.history-table tr:last-child td {
  border-bottom: none;
}

.history-table tr:hover {
  background-color: var(--light-color);
}

.history-table tr.feeding td:not(.task-type-label) {
  background-color: rgba(var(--feeding-color), 0.1);
}

.history-table tr.maintenance td:not(.task-type-label) {
  background-color: rgba(var(--maintenance-color), 0.1);
}

.history-table tr.harvest td:not(.task-type-label) {
  background-color: rgba(var(--harvest-color), 0.1);
}

.history-table tr.monitoring td:not(.task-type-label) {
  background-color: rgba(var(--monitoring-color), 0.1);
}

.history-table tr.cleaning td:not(.task-type-label) {
  background-color: rgba(var(--cleaning-color), 0.1);
}

.history-table .task-type-label {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
}

/* List View Styles */
.list-container {
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #E6E6FA;
}

.list-header h3 {
  color: var(--dark-color);
  font-size: 1.3rem;
  font-weight: 600;
}

.sort-controls {
  display: flex;
  gap: 10px;
}

.task-group {
  margin-bottom: 30px;
}

.group-title {
  color: var(--dark-color);
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--accent-color);
}

.group-tasks {
  display: grid;
  gap: 15px;
}

.task-card {
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
  background-color: #FFFFFF;
  transition: all 0.3s ease;
}

.task-card.feeding {
  border-left-color: var(--feeding-color);
  background-color: rgba(var(--feeding-color), 0.1);
}

.task-card.maintenance {
  border-left-color: var(--maintenance-color);
  background-color: rgba(var(--maintenance-color), 0.1);
}

.task-card.harvest {
  border-left-color: var(--harvest-color);
  background-color: rgba(var(--harvest-color), 0.1);
}

.task-card.monitoring {
  border-left-color: var(--monitoring-color);
  background-color: rgba(var(--monitoring-color), 0.1);
}

.task-card.cleaning {
  border-left-color: var(--cleaning-color);
  background-color: rgba(var(--cleaning-color), 0.1);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.task-info h5 {
  color: var(--dark-color);
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.task-description {
  color: #588157;
  font-size: 0.9rem;
  line-height: 1.4;
}

.task-actions {
  display: flex;
  gap: 5px;
}

.task-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #588157;
}

.task-details span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-details i {
  color: var(--primary-color);
}

.task-type-label {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
}

.task-type-label.feeding {
  background-color: var(--feeding-color);
}

.task-type-label.maintenance {
  background-color: var(--maintenance-color);
}

.task-type-label.harvest {
  background-color: var(--harvest-color);
}

.task-type-label.monitoring {
  background-color: var(--monitoring-color);
}

.task-type-label.cleaning {
  background-color: var(--cleaning-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E6E6FA;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: white;
  padding: 5px;
}

.task-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--dark-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #A3BFFA;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E6E6FA;
}

/* Reminder Panel */
.reminder-panel {
  position: fixed;
  top: var(--header-height);
  right: 20px;
  width: 350px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 200;
  max-height: 400px;
  overflow-y: auto;
}

.reminder-panel h4 {
  padding: 15px 20px;
  margin: 0;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  font-size: 1rem;
}

.reminder-list {
  padding: 10px;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  border-left: 4px solid var(--warning-color);
}

.reminder-item.urgent {
  border-left-color: var(--danger-color);
  background-color: rgba(var(--danger-color), 0.1);
}

.reminder-item.high {
  border-left-color: var(--warning-color);
  background-color: rgba(var(--warning-color), 0.1);
}

.reminder-content h5 {
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: var(--dark-color);
}

.reminder-content p {
  font-size: 0.8rem;
  color: #588157;
  margin-bottom: 4px;
}

.reminder-time {
  font-size: 0.75rem;
  color: var(--primary-color);
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 95;
  }
  
  .sidebar-collapsed {
    transform: translateX(0);
    width: var(--sidebar-width);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .content-expanded {
    margin-left: 0;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .view-controls,
  .filter-controls {
    justify-content: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .calendar-day {
    min-height: 80px;
    font-size: 0.8rem;
  }
  
  .task-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .reminder-panel {
    position: relative;
    right: auto;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .history-table {
    display: block;
    overflow-x: auto;
  }
  
  .history-table th,
  .history-table td {
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .calendar-day {
    min-height: 60px;
    padding: 4px;
  }
  
  .day-tasks {
    font-size: 0.65rem;
  }
  
  .task-card {
    padding: 15px;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
}
</style>
