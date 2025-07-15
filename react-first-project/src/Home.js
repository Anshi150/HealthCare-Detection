import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const testimonials = [
  {
    text: "Accurate health diagnostics helped me identify my condition at an early stage.",
    author: "John Smith"
  },
  {
    text: "Intuitive design and amazing customer service. Would recommend!",
    author: "Sarah Johnson"
  },
  {
    text: "Finally found real answers to my chronic symptoms!",
    author: "Michael Brown"
  },
  {
    text: "Helping me stay healthy with accurate information and fast diagnoses.",
    author: "Jessica Liu"
  }
];
function Home(){
     const [activeTestimonial, setActiveTestimonial] = useState(0);

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.jpeg" alt="Health Care Logo" />
        <span>Health Care</span>
      </div>
      <nav className="main-nav">
      <ul>
  <li><Link to="/">Home</Link></li>
  
  <li><Link to="/form">Open Form</Link></li>  
</ul>

      </nav>
      <div className="header-actions">
       
        <Link to="/login" className="login-button">Login</Link>

        <button className="menu-toggle">☰</button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Symptoms Based Health Care Detection System</h1>
        <div className="symptom-search">
          <input type="text" placeholder="Insert Your Symptoms" />
          
        </div>
      </div>
      <div className="hero-image">
        <div className="circle-background"></div>
      </div>
    </section>
  );
}

function SymptomSection() {
  const symptoms = [
    { name: "Diseases", icon: "🦠" },
    { name: "Stomach pain", icon: "👤" },
    { name: "Headache", icon: "🤕" },
    { name: "Wheezing", icon: "😮‍💨" },
    { name: "Body Ache", icon: "🧍" }
  ];

  return (
    <section className="symptoms-section">
      <h2 className="section-title">Symptoms</h2>
      <div className="symptoms-grid">
        {symptoms.map((symptom, index) => (
          <div className="symptom-card" key={index}>
            <div className="symptom-icon">{symptom.icon}</div>
            <div className="symptom-name">{symptom.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialSection({ testimonials, activeTestimonial, setActiveTestimonial }) {
  if (!Array.isArray(testimonials)) return null;
  return (
    <section className="testimonial-section">
      <h2 className="section-title">Read feedback about our Services and wonderful team!</h2>
      <p className="section-subtitle">Our patients love the care and attention they receive. Here's what some have to say about their experience with our platform.</p>
      
      <div className="testimonial-container">
        <div className="testimonial-cards">
          {testimonials.map((testimonial, index) => (
            <div 
              className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`} 
              key={index}
            >
              <div className="quote-mark">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <p className="author-name">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button 
              className={`dot ${index === activeTestimonial ? 'active' : ''}`}
              key={index}
              onClick={() => setActiveTestimonial(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MultilinDoctor</h3>
          <div className="social-icons">
            <span className="social-icon">○</span>
            <span className="social-icon">○</span>
            <span className="social-icon">○</span>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li>Home</li>
            <li>FAQs</li>
            <li>News</li>
            <li>About Us</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li>Our Story</li>
            <li>Our Team</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>support@multilin.com</li>
            <li>+1 800 123 4567</li>
            <li>Feedbacks, Issues</li>
            <li>Location, Canada</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Copyright 2023 MultilinDoctor. All Rights Reserved</p>
      </div>
    </footer>
  );
}
return (
   <>
   <div className="app-container">
      <div className="main-content">
      <Header />
      <HeroSection />
      <SymptomSection />

      <TestimonialSection
      testimonials={testimonials}
      activeTestimonal={activeTestimonial}
      setActiveTestimonal={setActiveTestimonial} 
      />
         <Footer />
   </div>
    </div>  
    </>
  );
}

export default Home;