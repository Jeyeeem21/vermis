```vue
<template>
  <div class="app-container">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet">
    
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <h1>Register Admin</h1>
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
      <div class="register-container">
        <h2>Register New Admin</h2>
        <form @submit.prevent="registerAdmin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required aria-label="Email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required aria-label="Password" />
          </div>
          <button type="submit" class="btn btn-primary">Register Admin</button>
        </form>
        <button @click="registerWithGoogle" class="btn btn-secondary">Register with Google</button>
        <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
       
      </div>
    </main>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { createUserWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

export default {
  name: 'RegisterAdmin',
  data() {
    return {
      email: '',
      password: '',
      message: '',
      success: false,
      sidebarCollapsed: false,
      currentTime: '',
      user: null,
    };
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);

    // Check current user
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  methods: {
    async registerAdmin() {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Store user data in Firestore
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: user.email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });

        // Do not sign out the currently logged-in user
        this.message = 'Admin registered successfully!';
        this.success = true;
        this.email = '';
        this.password = '';

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Admin account created successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        this.message = `Error: ${error.message}`;
        this.success = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to register admin: ${error.message}`,
        });
      }
    },
    async registerWithGoogle() {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Store user data in Firestore
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: user.email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });

        // Do not sign out the currently logged-in user
        this.message = 'Admin registered successfully with Google!';
        this.success = true;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Admin account created successfully with Google!',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        this.message = `Error: ${error.message}`;
        this.success = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to register admin: ${error.message}`,
        });
      }
    },
    goBack() {
      this.$router.push('/dashboard');
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    },
  },
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content-expanded {
  margin-left: var(--sidebar-collapsed-width);
}

/* Register Container */
.register-container {
  max-width: 450px;
  width: 100%;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-container h2 {
  color: var(--dark-color);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--dark-color);
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #A3BFFA;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

/* Buttons */
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
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
  background: linear-gradient(45deg, #4285F4, #34A853);
  color: white;
}

.btn-secondary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-back {
  background-color: #E6E6FA;
  color: var(--dark-color);
}

.btn-back:hover {
  background-color: #D6D6FA;
  transform: scale(1.05);
}

/* Messages */
p {
  margin-top: 20px;
  font-size: 0.95rem;
}

.success {
  color: var(--success-color);
}

.error {
  color: var(--danger-color);
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

  .register-container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .header-left h1 {
    font-size: 1.5rem;
  }

  .register-container {
    padding: 15px;
  }

  .register-container h2 {
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 10px;
  }

  .btn {
    padding: 10px;
  }
}
</style>