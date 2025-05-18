<template>
  <div class="app-container">
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
            <span class="notification-badge" v-if="unreadNotifications">!</span>
          </button>
          <div class="notification-dropdown" v-if="showNotifications">
            <div class="notification-header">
              <h3>System Alerts</h3>
              <button class="close-btn" @click="toggleNotifications">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="notification-list">
              <div class="notification-item alert" v-for="alert in alerts" :key="alert.id">
                <div class="notification-content">
                  <h4>{{ alert.title }}</h4>
                  <p>{{ alert.time }}</p>
                </div>
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
        <router-link to="/settings" class="nav-item">
          <i class="fas fa-cog"></i>
          <span class="nav-text">Settings</span>
        </router-link>
        <router-link to="/admin" class="nav-item">
          <i class="fas fa-user-shield"></i>
          <span class="nav-text">Admin Panel</span>
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
              <h3>Moisture</h3>
              <p class="card-value">{{ latestData.moisture ? latestData.moisture + '%' : 'N/A' }}</p>
              <p class="card-status">{{ getMoistureStatus(latestData.moisture) }}</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-icon npk">
              <i class="fas fa-flask"></i>
            </div>
            <div class="card-content">
              <h3>NPK Level</h3>
              <p class="card-value">{{ latestData.npk || 'N/A' }}</p>
              <p class="card-status">{{ latestData.npk ? 'Good' : 'Unknown' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Chart Section -->
        <div class="chart-container">
          <div class="simple-chart">
            <div class="chart-title">Sensor Data Overview</div>
            <div class="chart-body">
              <svg width="100%" height="300" viewBox="0 0 800 300">
                <!-- X-axis -->
                <line x1="50" y1="250" x2="750" y2="250" stroke="#ccc" stroke-width="2" />
                <!-- Y-axis -->
                <line x1="50" y1="50" x2="50" y2="250" stroke="#ccc" stroke-width="2" />
                
                <!-- Grid lines -->
                <line x1="50" y1="200" x2="750" y2="200" stroke="#eee" stroke-width="1" stroke-dasharray="5,5" />
                <line x1="50" y1="150" x2="750" y2="150" stroke="#eee" stroke-width="1" stroke-dasharray="5,5" />
                <line x1="50" y1="100" x2="750" y2="100" stroke="#eee" stroke-width="1" stroke-dasharray="5,5" />
                
                <!-- Temperature line and points -->
                <polyline 
                  :points="temperaturePoints" 
                  fill="none" 
                  stroke="#ff6384" 
                  stroke-width="3" 
                />
                <circle v-for="(point, index) in chartData" :key="'temp-' + index"
                        :cx="50 + (index * 100)" 
                        :cy="250 - ((point.temperature || 0) / 100 * 200)"
                        r="5" 
                        fill="#ff6384"
                        @mouseover="showTooltip($event, point, 'temperature')"
                        @mouseout="hideTooltip" />
                
                <!-- Humidity line and points -->
                <polyline 
                  :points="humidityPoints" 
                  fill="none" 
                  stroke="#36a2eb" 
                  stroke-width="3" 
                />
                <circle v-for="(point, index) in chartData" :key="'humid-' + index"
                        :cx="50 + (index * 100)" 
                        :cy="250 - ((point.humidity || 0) / 100 * 200)"
                        r="5" 
                        fill="#36a2eb"
                        @mouseover="showTooltip($event, point, 'humidity')"
                        @mouseout="hideTooltip" />
                
                <!-- Moisture line and points -->
                <polyline 
                  :points="moisturePoints" 
                  fill="none" 
                  stroke="#4bc0c0" 
                  stroke-width="3" 
                />
                <circle v-for="(point, index) in chartData" :key="'moisture-' + index"
                        :cx="50 + (index * 100)" 
                        :cy="250 - ((point.moisture || 0) / 100 * 200)"
                        r="5" 
                        fill="#4bc0c0"
                        @mouseover="showTooltip($event, point, 'moisture')"
                        @mouseout="hideTooltip" />
                
                <!-- X-axis Labels (Timestamps) -->
                <text v-for="(point, index) in chartData" :key="'x-label-' + index"
                      :x="50 + (index * 100)" y="270" text-anchor="middle">
                  {{ formatTimestamp(point.timestamp) }}
                </text>
                
                <!-- Y-axis Labels -->
                <text x="30" y="50" text-anchor="end">100</text>
                <text x="30" y="100" text-anchor="end">75</text>
                <text x="30" y="150" text-anchor="end">50</text>
                <text x="30" y="200" text-anchor="end">25</text>
                <text x="30" y="250" text-anchor="end">0</text>
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
                <span>Moisture</span>
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
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'HomeView',
  data() {
    return {
      sidebarCollapsed: false,
      showNotifications: false,
      unreadNotifications: false,
      currentTime: '',
      user: null,
      latestData: {
        temperature: null,
        humidity: null,
        moisture: null,
        npk: null
      },
      chartData: [],
      alerts: [],
      tooltip: {
        visible: false,
        style: {},
        type: '',
        value: '',
        time: ''
      }
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
      return this.generatePolylinePoints('moisture');
    }
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.fetchSensorData();
    setInterval(this.fetchSensorData, 5000);
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      if (!user) {
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
        hour12: true
      });
    },
    fetchSensorData() {
      const sensorQuery = query(
        collection(db, 'SensorData'),
        orderBy('timestamp', 'desc'),
        limit(7)
      );

      onSnapshot(sensorQuery, (snapshot) => {
        const data = [];
        const newAlerts = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            id: docData.id,
            temperature: docData.temperature,
            humidity: docData.humidity,
            moisture: docData.moisture || null,
            npk: docData.npk || null,
            timestamp: docData.timestamp
          });

          if (docData.temperature > 35) {
            newAlerts.push({
              id: doc.id + '-temp',
              title: 'High Temperature Alert',
              time: new Date(docData.timestamp).toLocaleString('en-US')
            });
          }
          if (docData.humidity < 50) {
            newAlerts.push({
              id: doc.id + '-humid',
              title: 'Low Humidity Detected',
              time: new Date(docData.timestamp).toLocaleString('en-US')
            });
          }
          if (docData.moisture && docData.moisture < 40) {
            newAlerts.push({
              id: doc.id + '-moisture',
              title: 'Low Moisture Detected',
              time: new Date(docData.timestamp).toLocaleString('en-US')
            });
          }
        });

        this.latestData = data[0] || {
          temperature: null,
          humidity: null,
          moisture: null,
          npk: null
        };

        this.chartData = data.reverse();
        this.alerts = newAlerts;
        this.unreadNotifications = newAlerts.length > 0;
      }, (error) => {
        console.error('Error fetching sensor data:', error);
      });
    },
    generatePolylinePoints(field) {
      if (!this.chartData.length) return '';
      const maxPoints = 7;
      const width = 700;
      const height = 200;
      const points = this.chartData.map((point, index) => {
        const x = 50 + (index * (width / (maxPoints - 1)));
        const value = point[field] || 0;
        const y = 250 - (value / 100 * height);
        return `${x},${y}`;
      });
      return points.join(' ');
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    getTemperatureStatus(temp) {
      if (!temp) return 'Unknown';
      if (temp > 35) return 'High';
      if (temp < 20) return 'Low';
      return 'Normal';
    },
    getHumidityStatus(humidity) {
      if (!humidity) return 'Unknown';
      if (humidity > 80) return 'High';
      if (humidity < 50) return 'Low';
      return 'Optimal';
    },
    getMoistureStatus(moisture) {
      if (!moisture) return 'Unknown';
      if (moisture > 60) return 'High';
      if (moisture < 40) return 'Low';
      return 'Optimal';
    },
    showTooltip(event, point, type) {
      const value = point[type] || 0;
      const unit = type === 'temperature' ? '°C' : '%';
      this.tooltip = {
        visible: true,
        style: {
          top: `${event.clientY - 50}px`,
          left: `${event.clientX + 10}px`
        },
        type: type.charAt(0).toUpperCase() + type.slice(1),
        value: `${value.toFixed(1)}${unit}`,
        time: new Date(point.timestamp).toLocaleString('en-US')
      };
    },
    hideTooltip() {
      this.tooltip.visible = false;
    }
  }
};
</script>

<style>
/* Import Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Base Styles */
:root {
  --primary-color: #4a6fa5;
  --secondary-color: #166088;
  --accent-color: #4fc3f7;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --success-color: #2ecc71;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 80px;
  --header-height: 60px;
}
/* Existing styles omitted for brevity, add the following for user-display */
.user-display {
  font-size: 0.9rem;
  color: var(--dark-color);
  font-weight: 500;
  padding: 5px 10px;
  border-left: 1px solid #ddd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f5f7fa;
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
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h1 {
  font-size: 1.5rem;
  color: var(--dark-color);
  font-weight: 600;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-color);
  padding: 5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.time-display {
  font-size: 1rem;
  color: var(--dark-color);
  font-weight: 500;
}

.notification-container {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-color);
  position: relative;
  padding: 5px 10px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: 0;
  background-color: var(--danger-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 350px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 110;
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
}

.notification-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.alert {
  border-left: 4px solid var(--danger-color);
}

.notification-content h4 {
  font-size: 1rem;
  color: var(--dark-color);
  margin-bottom: 5px;
}

.notification-content p {
  font-size: 0.85rem;
  color: #777;
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--dark-color);
  color: white;
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 90;
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-nav {
  padding: 15px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item i {
  font-size: 1.2rem;
  margin-right: 15px;
  width: 20px;
  text-align: center;
}

.nav-item.router-link-exact-active {
  background-color: var(--primary-color);
  color: white;
}

.nav-item.logout {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.6);
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

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 15px 0;
}

.sidebar-collapsed .nav-item i {
  margin-right: 0;
  font-size: 1.4rem;
}

/* Main Content Styles */
.main-content {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  padding: 20px;
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
  margin-bottom: 20px;
  font-weight: 600;
}

/* Cards Styles */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-right: 15px;
  flex-shrink: 0;
}

.card-iconWARN temperature {
  background-color: #ff6384;
}

.card-iconWARN humidity {
  background-color: #36a2eb;
}

.card-iconWARN moisture {
  background-color: #4bc0c0;
}

.card-iconWARN npk {
  background-color: #ffcd56;
}

.card-content h3 {
  font-size: 1rem;
  color: #777;
  margin-bottom: 5px;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 5px;
}

.card-status {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Chart Styles */
.chart-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
  position: relative;
}

.chart-title {
  font-size: 1.2rem;
  color: var(--dark-color);
  margin-bottom: 15px;
  font-weight: 600;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.legend-color.temperature {
  background-color: #ff6384;
}

.legend-color.humidity {
  background-color: #36a2eb;
}

.legend-color.moisture {
  background-color: #4bc0c0;
}

/* Tooltip Styles */
.tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  z-index: 120;
  pointer-events: none;
}

/* Status Styles */
.status-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.status-card h3 {
  font-size: 1.2rem;
  color: var(--dark-color);
  margin-bottom: 15px;
  font-weight: 600;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #777;
}

.status-value {
  font-weight: 500;
}

.status-value.normal {
  color: var(--success-color);
}

.status-value.online {
  color: var(--success-color);
}

.status-value.stable {
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
    font-size: 1.2rem;
  }
  
  .notification-dropdown {
    width: 280px;
    right: -20px;
  }
  
  .tooltip {
    font-size: 0.75rem;
    padding: 6px 10px;
  }
}
</style>