```vue
<template>
  <!-- Import Font Awesome for icons -->
  <div class="app-container">
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
          <h1>System Dashboard</h1>
        </div>
        <div class="header-right">
          <div class="notification-container">
            <button class="notification-btn" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" v-if="alerts.length">{{ alerts.length }}</span>
            </button>
            <div class="notification-dropdown" v-if="showNotifications">
              <div class="notification-header">
                <h3>System Alerts</h3>
                <div class="notification-actions">
                  <button class="clear-all-btn" @click="clearAllNotifications" v-if="alerts.length">
                    Clear All
                  </button>
                  <button class="close-btn" @click="toggleNotifications">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div class="notification-list">
                <div v-if="alerts.length === 0" class="no-notifications">
                  No notifications
                </div>
                <div class="notification-item alert" v-for="alert in alerts" :key="alert.id">
                  <div class="notification-content">
                    <h4>{{ alert.title }}</h4>
                    <p>{{ alert.time }}</p>
                  </div>
                  <button class="delete-btn" @click="deleteNotification(alert.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
        <div class="dashboard-content">
          <h2>Dashboard Overview</h2>
          
          <!-- Report Generation Section -->
          <div class="report-container">
            <h3>Generate Report</h3>
            <select v-model="reportType" class="report-select">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button class="report-btn" @click="generateReport">Generate Report</button>
          </div>

          <!-- Cards Section -->
          <div class="cards-container">
            <div class="card">
              <div class="card-icon temperature">
                <i class="fas fa-thermometer-half"></i>
              </div>
              <div class="card-content">
                <h3>Temperature</h3>
                <p class="card-value">{{ latestData.temperature ? latestData.temperature.toFixed(1) + '°C' : 'N/A' }}</p>
                <p class="card-status">{{ getTemperatureStatus(latestData.temperature) }}</p>
              </div>
            </div>
            <div class="card">
              <div class="card-icon humidity">
                <i class="fas fa-tint"></i>
              </div>
              <div class="card-content">
                <h3>Humidity</h3>
                <p class="card-value">{{ latestData.humidity ? latestData.humidity + '%' : 'N/A' }}</p>
                <p class="card-status">{{ getHumidityStatus(latestData.humidity) }}</p>
              </div>
            </div>
            <div class="card">
              <div class="card-icon moisture">
                <i class="fas fa-leaf"></i>
              </div>
              <div class="card-content">
                <h3>Soil Moisture</h3>
                <p class="card-value">{{ latestData.soilMoisture ? latestData.soilMoisture + '%' : 'N/A' }}</p>
                <p class="card-status">{{ getMoistureStatus(latestData.soilMoisture) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Chart Section -->
          <div class="chart-container">
            <div class="chart-controls">
              <h3>Chart Time Range</h3>
              <select v-model="chartType" @change="fetchSensorData" class="chart-select">
                <option value="hourly">Hourly (Current Date)</option>
                <option value="daily">Daily (Current Month)</option>
                <option value="monthly">Monthly (Current Year)</option>
                <option value="yearly">Yearly (All Years)</option>
              </select>
            </div>
            <div class="simple-chart">
              <div class="chart-title">Sensor Data Overview ({{ chartType.charAt(0).toUpperCase() + chartType.slice(1) }})</div>
              <div class="chart-body">
                <svg width="100%" height="300" viewBox="0 0 800 300">
                  <!-- X-axis -->
                  <line x1="50" y1="250" x2="750" y2="250" stroke="#A3BFFA" stroke-width="2" />
                  <!-- Y-axis -->
                  <line x1="50" y1="50" x2="50" y2="250" stroke="#A3BFFA" stroke-width="2" />
                  
                  <!-- Grid lines -->
                  <line x1="50" y1="200" x2="750" y2="200" stroke="#E6E6FA" stroke-width="1" stroke-dasharray="5,5" />
                  <line x1="50" y1="150" x2="750" y2="150" stroke="#E6E6FA" stroke-width="1" stroke-dasharray="5,5" />
                  <line x1="50" y1="100" x2="750" y2="100" stroke="#E6E6FA" stroke-width="1" stroke-dasharray="5,5" />
                  
                  <!-- Temperature line and points -->
                  <polyline 
                    :points="temperaturePoints" 
                    fill="none" 
                    stroke="#FF6B6B" 
                    stroke-width="3" 
                  />
                  <circle v-for="(point, index) in chartData" :key="'temp-' + index"
                          :cx="50 + (index * (700 / (chartData.length - 1 || 1)))" 
                          :cy="250 - ((point.temperature || 0) / 120 * 200)"
                          r="5" 
                          fill="#FF6B6B"
                          @mouseover="showTooltip($event, point, 'temperature')"
                          @mouseout="hideTooltip" />
                  
                  <!-- Humidity line and points -->
                  <polyline 
                    :points="humidityPoints" 
                    fill="none" 
                    stroke="#4ECDC4" 
                    stroke-width="3" 
                  />
                  <circle v-for="(point, index) in chartData" :key="'humid-' + index"
                          :cx="50 + (index * (700 / (chartData.length - 1 || 1)))" 
                          :cy="250 - ((point.humidity || 0) / 120 * 200)"
                          r="5" 
                          fill="#4ECDC4"
                          @mouseover="showTooltip($event, point, 'humidity')"
                          @mouseout="hideTooltip" />
                  
                  <!-- Moisture line and points -->
                  <polyline 
                    :points="moisturePoints" 
                    fill="none" 
                    stroke="#45B7D1" 
                    stroke-width="3" 
                  />
                  <circle v-for="(point, index) in chartData" :key="'moisture-' + index"
                          :cx="50 + (index * (700 / (chartData.length - 1 || 1)))" 
                          :cy="250 - ((point.soilMoisture || 0) / 120 * 200)"
                          r="5" 
                          fill="#45B7D1"
                          @mouseover="showTooltip($event, point, 'soilMoisture')"
                          @mouseout="hideTooltip" />
                  
                  <!-- X-axis Labels -->
                  <text v-for="(point, index) in chartData" :key="'x-label-' + index"
                        :x="50 + (index * (700 / (chartData.length - 1 || 1)))" 
                        y="270" 
                        text-anchor="middle"
                        fill="#1A3C34">
                    {{ formatTimestamp(point.label) }}
                  </text>
                  
                  <!-- Y-axis Labels -->
                  <text x="30" y="50" text-anchor="end" fill="#1A3C34">100</text>
                  <text x="30" y="100" text-anchor="end" fill="#1A3C34">75</text>
                  <text x="30" y="150" text-anchor="end" fill="#1A3C34">50</text>
                  <text x="30" y="200" text-anchor="end" fill="#1A3C34">25</text>
                  <text x="30" y="250" text-anchor="end" fill="#1A3C34">0</text>
                </svg>
                
                <!-- Tooltip -->
                <div v-if="tooltip.visible" class="tooltip" :style="tooltip.style">
                  <strong>{{ tooltip.type }}</strong><br>
                  Value: {{ tooltip.value }}<br>
                  Time: {{ tooltip.time }}
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color temperature"></span>
                  <span>Temperature</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color humidity"></span>
                  <span>Humidity</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color moisture"></span>
                  <span>Soil Moisture</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- System Status Section -->
          <div class="status-container">
            <div class="status-card">
              <h3>System Health</h3>
              <div class="status-item">
                <span class="status-label">Power:</span>
                <span class="status-value normal">Normal</span>
              </div>
              <div class="status-item">
                <span class="status-label">Sensors:</span>
                <span class="status-value online">All Online</span>
              </div>
              <div class="status-item">
                <span class="status-label">Environment:</span>
                <span class="status-value stable">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'HomeView',
  data() {
    return {
      sidebarCollapsed: false,
      showNotifications: false,
      unreadNotifications: false,
      currentTime: '',
      user: null,
      authLoading: true,
      reportType: 'daily',
      chartType: 'daily',
      latestData: {
        temperature: null,
        humidity: null,
        soilMoisture: null,
      },
      chartData: [],
      alerts: [],
      tooltip: {
        visible: false,
        style: {},
        type: '',
        value: '',
        time: '',
      },
      dataFetched: false,
    };
  },
  computed: {
    temperaturePoints() {
      return this.generatePolylinePoints('temperature');
    },
    humidityPoints() {
      return this.generatePolylinePoints('humidity');
    },
    moisturePoints() {
      return this.generatePolylinePoints('soilMoisture');
    },
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.authLoading = false;
        if (!this.dataFetched) {
          this.fetchSensorData();
          setInterval(this.fetchSensorData, 1800000);
          this.dataFetched = true;
        }
      } else {
        console.error('User is not authenticated');
        this.authLoading = false;
        this.user = null;
        this.$router.push('/login');
      }
    });
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (!this.showNotifications) {
        this.unreadNotifications = false;
      }
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    },
    async fetchSensorData() {
      if (!this.user || !this.user.uid) {
        console.error('User is not authenticated');
        return;
      }

      // Sensor data logic
      const now = new Date();
      let startDate, endDate, groupBy;

      if (this.chartType === 'hourly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        groupBy = 'hour';
      } else if (this.chartType === 'daily') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        groupBy = 'day';
      } else if (this.chartType === 'monthly') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        groupBy = 'month';
      } else if (this.chartType === 'yearly') {
        startDate = new Date(0);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        groupBy = 'year';
      }

      const sensorQuery = query(
        collection(db, 'SensorData'),
        where('timestamp', '>=', startDate.toISOString()),
        where('timestamp', '<', endDate.toISOString()),
        orderBy('timestamp', 'asc')
      );

      try {
        const snapshot = await getDocs(sensorQuery);
        const rawData = [];
        const newAlerts = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();
          rawData.push({
            id: doc.id,
            temperature: docData.temperature,
            humidity: docData.humidity,
            soilMoisture: docData.soilMoisture || null,
            timestamp: docData.timestamp,
          });

          if (docData.temperature > 35) {
            newAlerts.push({
              id: doc.id + '-temp',
              title: 'High Temperature Alert',
              time: new Date(docData.timestamp).toLocaleString('en-US'),
            });
          }
          if (docData.humidity < 50) {
            newAlerts.push({
              id: doc.id + '-humid',
              title: 'Low Humidity Detected',
              time: new Date(docData.timestamp).toLocaleString('en-US'),
            });
          }
          if (docData.soilMoisture && docData.soilMoisture < 40) {
            newAlerts.push({
              id: doc.id + '-moisture',
              title: 'Low Soil Moisture Detected',
              time: new Date(docData.timestamp).toLocaleString('en-US'),
            });
          }
        });

        const aggregatedData = this.aggregateData(rawData, groupBy);
        this.chartData = aggregatedData;
        this.latestData = rawData.length > 0 ? rawData[rawData.length - 1] : {
          temperature: null,
          humidity: null,
          soilMoisture: null,
        };

        // Task fetching and notification logic
        const taskQuery = query(
          collection(db, 'tasks'),
          orderBy('date', 'asc')
        );

        try {
          const snapshot = await getDocs(taskQuery);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          snapshot.forEach((doc) => {
            const taskData = doc.data();
            // Check essential fields and completion status
            if (
              taskData.assignedTo === 'admin' &&
              (taskData.completed === false || taskData.completedAt === null || typeof taskData.completedAt === 'undefined') &&
              taskData.date &&
              taskData.title &&
              taskData.id
            ) {
              // Handle date flexibly (string or Firestore Timestamp)
              let taskDate;
              if (typeof taskData.date === 'string') {
                taskDate = new Date(taskData.date);
              } else if (taskData.date && typeof taskData.date.toDate === 'function') {
                taskDate = taskData.date.toDate(); // Convert Firestore Timestamp
              } else {
                console.warn('Invalid task date format for task:', taskData.id);
                return;
              }
              
              if (isNaN(taskDate)) {
                console.warn('Unable to parse task date for task:', taskData.id);
                return;
              }
              
              taskDate.setHours(0, 0, 0, 0);
              const timeDiff = taskDate.getTime() - today.getTime();
              const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
              let shouldNotify = false;

              // Determine if notification is needed based on recurrence
              if (taskData.recurrence === 'custom' && taskData.customInterval) {
                shouldNotify = daysUntil >= 0 && daysUntil % taskData.customInterval === 0;
              } else if (taskData.recurrence === 'daily') {
                shouldNotify = true; // Notify every day for daily tasks, past or future
              } else if (taskData.recurrence === 'weekly') {
                shouldNotify = daysUntil >= 0 && daysUntil % 7 === 0;
              } else if (taskData.recurrence === 'bi-weekly') {
                shouldNotify = daysUntil >= 0 && daysUntil % 14 === 0;
              } else if (taskData.recurrence === 'monthly') {
                const taskMonth = taskDate.getMonth();
                const todayMonth = today.getMonth();
                const taskYear = taskDate.getFullYear();
                const todayYear = today.getFullYear();
                // Notify if day matches and we're in a future or current month
                shouldNotify =
                  taskDate.getDate() === today.getDate() &&
                  (todayYear > taskYear || (todayYear === taskYear && todayMonth >= taskMonth));
              } else {
                // For non-recurring tasks, notify on the task date
                shouldNotify = daysUntil === 0;
              }

              if (shouldNotify) {
                newAlerts.push({
                  id: taskData.id,
                  title: `Task Alert: ${taskData.title}`,
                  time: taskData.createdAt && typeof taskData.createdAt === 'string'
                    ? new Date(taskData.createdAt).toLocaleString('en-US')
                    : taskDate.toLocaleString('en-US'), // Fallback to task date
                });
              }
            } else {
              console.warn('Task missing required fields, not for admin, or already completed:', taskData.id);
            }
          });

          // Sort alerts by time (newest first)
          newAlerts.sort((a, b) => {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);
            return dateB.getTime() - dateA.getTime();
          });

          this.alerts = newAlerts;
          this.unreadNotifications = newAlerts.length > 0;
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    },
    aggregateData(rawData, groupBy) {
      const grouped = {};

      rawData.forEach((entry) => {
        const date = new Date(entry.timestamp);
        let key;

        if (groupBy === 'hour') {
          key = date.getHours();
        } else if (groupBy === 'day') {
          key = date.getDate();
        } else if (groupBy === 'month') {
          key = date.getMonth();
        } else if (groupBy === 'year') {
          key = date.getFullYear();
        }

        if (!grouped[key]) {
          grouped[key] = {
            temperature: [],
            humidity: [],
            soilMoisture: [],
            label: groupBy === 'hour' ? `${key}:00` :
                   groupBy === 'day' ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) :
                   groupBy === 'month' ? date.toLocaleDateString('en-US', { month: 'short' }) :
                   `${key}`,
          };
        }

        if (entry.temperature != null) grouped[key].temperature.push(entry.temperature);
        if (entry.humidity != null) grouped[key].humidity.push(entry.humidity);
        if (entry.soilMoisture != null) grouped[key].soilMoisture.push(entry.soilMoisture);
      });

      const aggregated = [];
      for (const key in grouped) {
        const group = grouped[key];
        const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
        aggregated.push({
          temperature: avg(group.temperature),
          humidity: avg(group.humidity),
          soilMoisture: avg(group.soilMoisture),
          label: group.label,
        });
      }

      return aggregated.sort((a, b) => {
        const aKey = parseInt(a.label) || new Date(a.label).getTime();
        const bKey = parseInt(b.label) || new Date(b.label).getTime();
        return aKey - bKey;
      });
    },
    async generateReport() {
      if (!this.user || !this.user.uid) {
        console.error('User is not authenticated');
        return;
      }

      const now = new Date();
      let startDate, endDate;
      if (this.reportType === 'daily') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      } else if (this.reportType === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else if (this.reportType === 'yearly') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
      }

      const reportQuery = query(
        collection(db, 'SensorData'),
        where('timestamp', '>=', startDate.toISOString()),
        where('timestamp', '<', endDate.toISOString()),
        orderBy('timestamp', 'asc')
      );

      try {
        const snapshot = await getDocs(reportQuery);
        const reportData = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          reportData.push([
            new Date(docData.timestamp).toLocaleString('en-US'),
            docData.temperature ? docData.temperature.toFixed(1) : 'N/A',
            docData.humidity ? docData.humidity.toFixed(0) : 'N/A',
            docData.soilMoisture ? docData.soilMoisture.toFixed(0) : 'N/A',
          ]);
        });

        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('VermiTech Environmental Sensor Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)} Report`, pageWidth / 2, 28, { align: 'center' });
        doc.text(`Generated on ${now.toLocaleDateString('en-US')}`, pageWidth / 2, 34, { align: 'center' });

        autoTable(doc, {
          startY: 50,
          head: [['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Soil Moisture (%)']],
          body: reportData,
          styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
          },
          headStyles: {
            fillColor: [39, 174, 96], // Aligned with #27AE60
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [240, 247, 244], // Aligned with #F0F7F4
          },
          tableWidth: 'auto',
          margin: { left: 15, right: 15 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 },
          },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
          doc.text(`Generated on ${now.toLocaleDateString('en-US')}`, 20, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save(`VermiTech_${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)}_Report.pdf`);
      } catch (error) {
        console.error('Error generating report:', error);
      }
    },
    generatePolylinePoints(field) {
      if (!this.chartData.length) return '';
      const width = 700;
      const height = 200;
      const maxValue = 120;
      const points = this.chartData.map((point, index) => {
        const x = 50 + (index * (width / (this.chartData.length - 1 || 1)));
        const value = point[field] || 0;
        const y = 250 - (value / maxValue * height);
        return `${x},${y}`;
      });
      return points.join(' ');
    },
    formatTimestamp(label) {
      if (!label) return '';
      if (this.chartType === 'hourly') {
        return label;
      } else if (this.chartType === 'daily') {
        return label;
      } else if (this.chartType === 'monthly') {
        return label;
      } else if (this.chartType === 'yearly') {
        return label;
      }
      return label;
    },
    getTemperatureStatus(temp) {
      if (temp == null) return 'Unknown';
      if (temp > 35) return 'High';
      if (temp < 20) return 'Low';
      return 'Normal';
    },
    getHumidityStatus(humidity) {
      if (humidity == null) return 'Unknown';
      if (humidity > 80) return 'High';
      if (humidity < 50) return 'Low';
      return 'Optimal';
    },
    getMoistureStatus(moisture) {
      if (moisture == null) return 'Unknown';
      if (moisture > 60) return 'High';
      if (moisture < 40) return 'Low';
      return 'Optimal';
    },
    showTooltip(event, point, type) {
      const value = point[type] || 0;
      const unit = type === 'temperature' ? '°C' : '%';
      const displayType = type === 'soilMoisture' ? 'Soil Moisture' : type.charAt(0).toUpperCase() + type.slice(1);
      this.tooltip = {
        visible: true,
        style: {
          top: `${event.clientY - 50}px`,
          left: `${event.clientX + 10}px`,
        },
        type: displayType,
        value: `${value.toFixed(1)}${unit}`,
        time: point.label,
      };
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    deleteNotification(id) {
      this.alerts = this.alerts.filter(alert => alert.id !== id);
      this.unreadNotifications = this.alerts.length > 0;
    },
    clearAllNotifications() {
      this.alerts = [];
      this.unreadNotifications = false;
    },
  },
};
</script>

<style>
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

.notification-container {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: var(--dark-color);
  position: relative;
  padding: 8px;
  transition: transform 0.3s ease;
}

.notification-btn:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--danger-color);
  color: white;
  border-radius: 50%;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0 6px;
}

.notification-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  width: 360px;
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 110;
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
}

.notification-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.notification-actions {
  display: flex;
  gap: 12px;
}

.clear-all-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 6px 12px;
  transition: background-color 0.3s ease;
}

.clear-all-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #588157;
  font-size: 0.95rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #E6E6FA;
  transition: background-color 0.3s ease;
}

.notification-item:hover {
  background: var(--light-color);
}

.notification-item.alert {
  border-left: 5px solid var(--danger-color);
}

.notification-content h4 {
  font-size: 1rem;
  color: var(--dark-color);
  margin-bottom: 6px;
}

.notification-content p {
  font-size: 0.85rem;
  color: #588157;
}

.delete-btn {
  background: none;
  border: none;
  color: #588157;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: var(--danger-color);
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

/* Main Content Styles */
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

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-content h2 {
  color: var(--dark-color);
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 2rem;
}

/* Report Generation Styles */
.report-container {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.report-container h3 {
  font-size: 1.3rem;
  color: var(--dark-color);
  font-weight: 600;
}

.report-select, .chart-select {
  padding: 10px;
  border: 1px solid #A3BFFA;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--dark-color);
  background: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.report-select:hover, .chart-select:hover {
  border-color: var(--primary-color);
}

.report-btn {
  padding: 10px 20px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.report-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Chart Controls Styles */
.chart-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-controls h3 {
  font-size: 1.3rem;
  color: var(--dark-color);
  font-weight: 600;
}

/* Cards Styles */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.card {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  display: flex;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  margin-right: 20px;
  flex-shrink: 0;
}

.card-icon.temperature {
  background: #FF6B6B;
}

.card-icon.humidity {
  background: #4ECDC4;
}

.card-icon.moisture {
  background: #45B7D1;
}

.card-content h3 {
  font-size: 1.1rem;
  color: #588157;
  margin-bottom: 8px;
}

.card-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 8px;
}

.card-status {
  font-size: 0.95rem;
  font-weight: 500;
}

/* Chart Styles */
.chart-container {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 40px;
  position: relative;
}

.chart-title {
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
  font-weight: 600;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.legend-color {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.legend-color.temperature {
  background: #FF6B6B;
}

.legend-color.humidity {
  background: #4ECDC4;
}

.legend-color.moisture {
  background: #45B7D1;
}

/* Tooltip Styles */
.tooltip {
  position: fixed;
  background: rgba(26, 60, 52, 0.9); /* Aligned with --dark-color */
  color: white;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  z-index: 120;
  pointer-events: none;
}

/* Status Styles */
.status-container {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.status-card h3 {
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 20px;
  font-weight: 600;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #E6E6FA;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #588157;
}

.status-value {
  font-weight: 500;
}

.status-value.normal, .status-value.online, .status-value.stable {
  color: var(--success-color);
}

/* Responsive Styles */
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
  
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .notification-dropdown {
    width: 300px;
    right: -10px;
  }
  
  .tooltip {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
  
  .report-container, .chart-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .report-select, .chart-select, .report-btn {
    width: 100%;
  }
}
</style>
```