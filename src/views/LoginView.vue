```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-area">
        <div class="plant-icon">🌿</div>
        <div class="company-info">
          <h1>Welcome to VermiTech</h1>
          <p class="description">
            Log in to manage your sustainable vermicomposting solutions.
          </p>
        </div>
      </div>

      <h2 class="login-title">Login</h2>

      <form @submit.prevent="handleEmailAuth" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-with-icon">
            <i class="fas fa-envelope icon"></i>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-with-icon">
            <i class="fas fa-lock icon"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
            <i
              class="fas toggle-password"
              :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPassword = !showPassword"
              title="Toggle password visibility"
            ></i>
          </div>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="auth-btn">
          Login
        </button>
      </form>

      <div class="divider">OR</div>
      <button class="google-btn" @click="signInWithGoogle">
        <i class="fab fa-google"></i> Sign in with Google
      </button>

      <div class="additional-features">
        <p>
          <a href="#">Forgot your password?</a>
        </p>
        <p class="footer-text">
          © {{ new Date().getFullYear() }} VermiTech. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
@import url('https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #27AE60, #219653);
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
}

.login-card {
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  padding: 50px;
  width: 100%;
  max-width: 480px;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.plant-icon {
  font-size: 4rem;
  color: #27AE60;
  margin-bottom: 15px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.company-info h1 {
  color: #1A3C34;
  margin-bottom: 15px;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.company-info .description {
  color: #344E41;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 380px;
  margin: 0 auto;
  opacity: 0.9;
}

.login-title {
  color: #1A3C34;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

.form-group label {
  display: block;
  color: #1A3C34;
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #588157;
  font-size: 1.2rem;
  z-index: 1;
}

.form-group input {
  width: 100%;
  padding: 14px 15px 14px 45px;
  border: 2px solid #F0F7F4;
  border-radius: 12px;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
  background: #F9FBFA;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #27AE60;
  box-shadow: 0 0 10px rgba(39, 174, 96, 0.3);
  background: #FFFFFF;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #588157;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 1;
}

.toggle-password:hover {
  color: #27AE60;
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #27AE60, #2ECC71);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.auth-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.auth-btn:active {
  transform: scale(1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.divider {
  margin: 40px 0;
  color: #588157;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 2px;
  background: #F0F7F4;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.google-btn {
  width: 100%;
  padding: 16px;
  background: #FFFFFF;
  color: #4285F4;
  border: 2px solid #E8F0FE;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background: #E8F0FE;
  border-color: #4285F4;
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.google-btn:active {
  transform: scale(1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.google-btn i {
  font-size: 1.5rem;
}

.error-message {
  color: #FF6B6B;
  font-size: 0.95rem;
  margin-top: -10px;
  margin-bottom: 20px;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #FF6B6B;
  font-weight: 500;
}

.additional-features {
  margin-top: 30px;
  font-size: 0.95rem;
  color: #588157;
}

.additional-features a {
  color: #27AE60;
  text-decoration: none;
  transition: color 0.3s ease;
}

.additional-features a:hover {
  color: #219653;
  text-decoration: underline;
}

.footer-text {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #A3BFFA;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 30px;
    max-width: 380px;
  }
  .company-info h1 {
    font-size: 2rem;
  }
  .company-info .description {
    font-size: 0.9rem;
  }
  .login-title {
    font-size: 1.5rem;
  }
  .auth-btn, .google-btn {
    font-size: 1.1rem;
    padding: 14px;
  }
}
</style>

<script>
import { auth, googleProvider } from '@/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: null
    };
  },
  methods: {
    async handleEmailAuth() {
      try {
        const db = getFirestore();
        // Attempt to sign in with email and password
        const userRecord = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userRecord.user;

        // Verify user exists in Firestore
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (!docSnap.exists()) {
          // If no Firestore document exists, sign out and show error
          await signOut(auth);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'This account is not registered in our system. Please contact an administrator.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
          return;
        }

        // Check and update admin role if necessary
        const isAdmin = user.uid === 'M4zSJ3eXrgSHDhye1Jxqq6fw9d03';
        if (isAdmin && docSnap.data().role !== 'admin') {
          await setDoc(userDoc, { role: 'admin' }, { merge: true });
        }

        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please check your credentials or contact an administrator.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: 'An error occurred during login. Please try again later.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
          console.error('Login error:', error);
        }
      }
    },
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const db = getFirestore();
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (!docSnap.exists()) {
          // If no Firestore document exists, sign out and show error
          await signOut(auth);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'This Google account is not registered in our system. Please contact an administrator.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
          return;
        }

        // Check and update admin role if necessary
        const isAdmin = user.uid === 'M4zSJ3eXrgSHDhye1Jxqq6fw9d03';
        if (isAdmin && docSnap.data().role !== 'admin') {
          await setDoc(userDoc, { role: 'admin' }, { merge: true });
        }

        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        await signOut(auth);
        if (error.code === 'auth/popup-closed-by-user') {
          Swal.fire({
            icon: 'info',
            title: 'Sign-In Cancelled',
            text: 'Google sign-in was cancelled.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Sign-In Failed',
            text: 'Failed to sign in with Google. Please try again or contact an administrator.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#27AE60'
          });
          console.error('Google sign-in error:', error);
        }
      }
    }
  }
};
</script>
