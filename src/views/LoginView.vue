<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
      <form @submit.prevent="handleEmailAuth">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="auth-btn">
          {{ isSignUp ? 'Sign Up' : 'Login' }}
        </button>
        <button type="button" class="toggle-btn" @click="toggleAuthMode">
          {{ isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up' }}
        </button>
      </form>
      <div class="divider">OR</div>
      <button class="google-btn" @click="signInWithGoogle">
        <i class="fab fa-google"></i> Sign in with Google
      </button>
    </div>
  </div>
</template>

<script>
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/firebase';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      isSignUp: false
    };
  },
  methods: {
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
        this.$router.push('/');
      } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          this.error = 'Google sign-in was cancelled.';
        } else {
          this.error = 'Failed to sign in with Google. Please try again.';
        }
        console.error('Google sign-in error:', error);
      }
    },
    async handleEmailAuth() {
      try {
        if (this.isSignUp) {
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push('/');
        } else {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push('/');
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            this.error = 'No account found with this email. Please sign up.';
            break;
          case 'auth/wrong-password':
            this.error = 'Incorrect password. Please try again.';
            break;
          case 'auth/email-already-in-use':
            this.error = 'This email is already registered. Please log in.';
            break;
          case 'auth/invalid-email':
            this.error = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            this.error = 'Password should be at least 6 characters.';
            break;
          default:
            this.error = 'Authentication failed. Please try again.';
            console.error('Authentication error:', error);
        }
      }
    },
    toggleAuthMode() {
      this.isSignUp = !this.isSignUp;
      this.error = '';
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  color: #777;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

.form-group input:focus {
  border-color: #4a6fa5;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-btn:hover {
  background-color: #166088;
}

.toggle-btn {
  background: none;
  border: none;
  color: #4a6fa5;
  font-size: 0.9rem;
  margin-top: 10px;
  cursor: pointer;
}

.divider {
  margin: 20px 0;
  color: #777;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.google-btn {
  width: 100%;
  padding: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.google-btn:hover {
  background-color: #357ae8;
}

.google-btn i {
  font-size: 1.2rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-bottom: 15px;
}
</style>