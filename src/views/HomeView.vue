<template>
  <div class="homepage-container">
    <header class="main-header">
      <div class="header-left">
        <div class="header-logo">🌿</div>
        <h1 class="header-title">Vermi Tech</h1>
      </div>
      <nav class="main-nav">
        <a href="#hero" @click.prevent="scrollToSection('hero-section')">Home</a>
        <a href="#mission" @click.prevent="scrollToSection('mission-section')">Our Mission</a>
        <a href="#features" @click.prevent="scrollToSection('features')">Features</a>
        <a href="#contact" @click.prevent="scrollToSection('contact')">Contact</a>
      </nav>
      <div class="header-right">
        <button class="login-button" @click="goToLogin">Login</button>
      </div>
    </header>

    <section id="hero-section" class="hero-section">
      <div class="hero-content">
        <div class="hero-icon-logo">
          <i class="fas fa-seedling"></i>
        </div>
        <h2 class="hero-title">Transforming Agriculture with Vermicomposting</h2>
        <p class="hero-description">
          Unleash the power of sustainable farming with our innovative vermicomposting solutions for richer soil and a thriving planet.
        </p>
        <button class="learn-more-button" @click="scrollToSection('features')">Discover Now</button>
      </div>
      <div class="hero-image">
        <img src="/img/vermicompost-illustration.jpg" alt="VermiComposting Illustration">
      </div>
    </section>

    <section id="mission-section" class="mission-section">
      <div class="mission-content">
        <h3 class="section-title">Our Mission: Growing a Greener Tomorrow</h3>
        <p class="mission-text">
          Vermi Tech is committed to revolutionizing agriculture by turning organic waste into nutrient-rich compost, promoting sustainability, and empowering communities worldwide.
        </p>
        <div class="mission-stats">
          <div class="stat-item">
            <span class="stat-number">12+</span>
            <span class="stat-label">Years of Innovation</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">750+</span>
            <span class="stat-label">Thriving Farmers</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">2M+</span>
            <span class="stat-label">Tons Composted</span>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="features-section">
      <h3 class="section-title">Our Cutting-Edge Solutions</h3>
      <div class="feature-grid">
        <div class="feature-card">
          <i class="fas fa-globe-americas feature-icon"></i>
          <h4>Eco-Friendly Farming</h4>
          <p>Adopt sustainable practices that nurture the earth and boost crop vitality.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-leaf feature-icon"></i>
          <h4>Premium Compost</h4>
          <p>Create nutrient-packed organic fertilizer for healthier, stronger plants.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-recycle feature-icon"></i>
          <h4>Smart Waste Solutions</h4>
          <p>Convert organic waste into valuable resources, reducing environmental impact.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-hands-helping feature-icon"></i>
          <h4>Community Growth</h4>
          <p>Empower local farmers with accessible, innovative composting techniques.</p>
        </div>
      </div>
      <button class="about-button" @click="scrollToSection('contact')">Learn More</button>
    </section>

    <section id="cta-section" class="cta-section">
      <h3 class="section-title">Join the Green Revolution</h3>
      <p class="cta-description">Take the first step towards sustainable agriculture. Start your vermicomposting journey today!</p>
      <button class="cta-button" @click="goToLogin">Start Now</button>
    </section>

    <section id="contact" class="contact-section">
      <h3 class="section-title">Connect With Us</h3>
      <div class="contact-content">
        <div class="contact-card">
          <i class="fas fa-map-marker-alt contact-icon"></i>
          <h4>Our Location</h4>
          <p>123 Eco-Friendly Lane, Green Valley, Earth 12345</p>
        </div>
        <div class="contact-card">
          <i class="fas fa-envelope contact-icon"></i>
          <h4>Email Us</h4>
          <p><a href="mailto:info@vermitech.com">info@vermitech.com</a></p>
        </div>
        <div class="contact-card">
          <i class="fas fa-phone-alt contact-icon"></i>
          <h4>Call Us</h4>
          <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
        </div>
      </div>
    </section>

    <footer class="main-footer">
      <p>© {{ new Date().getFullYear() }} Vermi Tech. All rights reserved.</p>
      <div class="footer-social-links">
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleScroll() {
      const header = document.querySelector('.main-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.homepage-container {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1A3C34;
  line-height: 1.7;
  background-color: #F0F7F4;
  overflow-x: hidden;
}

/* Reusable Section Title */
.section-title {
  font-size: 3rem;
  color: #1A3C34;
  margin-bottom: 50px;
  font-weight: 700;
  text-align: center;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, #2ECC71, #27AE60);
  border-radius: 3px;
}

/* Header */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 6%;
  background: linear-gradient(180deg, #FFFFFF, #F0F7F4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s ease;
}

.main-header.scrolled {
  padding: 15px 6%;
  background: #FFFFFF;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  font-size: 2.5rem;
  color: #27AE60;
}

.header-title {
  font-size: 2rem;
  color: #1A3C34;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.main-nav a {
  color: #1A3C34;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  transition: color 0.3s ease;
}

.main-nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  background: #2ECC71;
  bottom: -8px;
  left: 0;
  transition: width 0.3s ease;
}

.main-nav a:hover {
  color: #27AE60;
}

.main-nav a:hover::after {
  width: 100%;
}

.login-button {
  background: linear-gradient(45deg, #2ECC71, #27AE60);
  color: white;
  padding: 12px 30px;
 synergies: #FFFFFF;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.login-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 6%;
  background: linear-gradient(135deg, #2ECC71, #219653);
  color: white;
  min-height: 90vh;
  gap: 50px;
}

@media (min-width: 768px) {
  .hero-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .hero-content {
    max-width: 45%;
  }
}

.hero-icon-logo {
  font-size: 5rem;
  color: #F0F7F4;
  margin-bottom: 25px;
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 25px;
}

.hero-description {
  font-size: 1.3rem;
  margin-bottom: 35px;
  max-width: 600px;
  opacity: 0.9;
}

.learn-more-button {
  background: #FFFFFF;
  color: #219653;
  padding: 16px 40px;
  border: 2px solid #FFFFFF;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learn-more-button:hover {
  background: transparent;
  color: #FFFFFF;
  transform: translateY(-3px);
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
}

.hero-image img:hover {
  transform: scale(1.03);
}

/* Mission Section */
.mission-section {
  padding: 100px 6%;
  background: #F0F7F4;
  text-align: center;
}

.mission-content {
  max-width: 1000px;
  margin: 0 auto;
}

.mission-text {
  font-size: 1.2rem;
  color: #344E41;
  margin-bottom: 50px;
  line-height: 1.9;
}

.mission-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  margin-top: 50px;
}

.stat-item {
  background: #FFFFFF;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #27AE60;
  display: block;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1rem;
  color: #588157;
}

/* Features Section */
.features-section {
  padding: 100px 6%;
  background: #FFFFFF;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.feature-card {
  background: linear-gradient(145deg, #F0F7F4, #FFFFFF);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 4rem;
  color: #27AE60;
  margin-bottom: 20px;
}

.feature-card h4 {
  font-size: 1.8rem;
  color: #1A3C34;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  font-size: 1.1rem;
  color: #344E41;
}

.about-button {
  background: linear-gradient(45deg, #2ECC71, #27AE60);
  color: white;
  padding: 14px 35px;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.about-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

/* Call to Action Section */
.cta-section {
  padding: 100px 6%;
  background: linear-gradient(135deg, #27AE60, #219653);
  color: white;
  text-align: center;
}

.cta-section .section-title {
  color: white;
}

.cta-section .section-title::after {
  background: white;
}

.cta-description {
  font-size: 1.4rem;
  margin-bottom: 50px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
}

.cta-button {
  background: #FFFFFF;
  color: #219653;
  padding: 20px 50px;
  border: 2px solid #FFFFFF;
  border-radius: 35px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: transparent;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* Contact Section */
.contact-section {
  padding: 100px 6%;
  background: #F0F7F4;
  text-align: center;
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
}

.contact-card {
  background: #FFFFFF;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 4rem;
  color: #27AE60;
  margin-bottom: 20px;
}

.contact-card h4 {
  font-size: 1.8rem;
  color: #1A3C34;
  margin-bottom: 15px;
  font-weight: 600;
}

.contact-card p {
  font-size: 1.1rem;
  color: #344E41;
}

.contact-card a {
  color: #27AE60;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-card a:hover {
  color: #219653;
  text-decoration: underline;
}

/* Footer */
.main-footer {
  background: #1A3C34;
  color: #F0F7F4;
  padding: 40px 6%;
  text-align: center;
  font-size: 1rem;
}

.footer-social-links a {
  color: #F0F7F4;
  font-size: 1.8rem;
  margin: 0 15px;
  transition: color 0.3s ease;
}

.footer-social-links a:hover {
  color: #2ECC71;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .main-header {
    flex-direction: column;
    gap: 20px;
  }
  .main-nav {
    flex-direction: column;
    gap: 15px;
  }
  .hero-section {
    padding: 80px 6%;
  }
  .hero-title {
    font-size: 2.8rem;
  }
  .section-title {
    font-size: 2.5rem;
  }
  .mission-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-description {
    font-size: 1.1rem;
  }
  .learn-more-button, .cta-button {
    font-size: 1.1rem;
    padding: 14px 30px;
  }
  .section-title {
    font-size: 2rem;
  }
}
</style>