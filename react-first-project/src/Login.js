import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn}) {
  const [userId, setuserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
 
 try{
   const response = await fetch("http://localhost:5000/api/auth/Login", {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
    },
     body: JSON.stringify({ userId, password }),
   });

    const data = await response.json();

    if(!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    alert(data.message);
    console.log("login Sucess", data)

    setIsLoggedIn(true);
    navigate("/Home");
    }catch (error) {
      alert(error.message);
      console.log("Login Error:",error)
    }
  
   console.log("Login attempt with:", { userId, password, rememberMe });
  }

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="logo-container">
          <div className="logo">
            <img src="/logo.jpeg" alt="Health Care Logo" />
            <span>Health Care</span>
          </div>
        </div>
        <div className="sidebar-content">
          <h1>Symptoms Based Health Care Detection System</h1>
          <p>Sign in to access your health dashboard and manage your healthcare needs efficiently.</p>
          <div className="health-illustration">
            <div className="circle-background"></div>
          </div>
        </div>
      </div>

      <div className="login-main">
        <div className="login-box">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="userId">Id Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="userId"
                  id="userId"
                  placeholder="Enter your email"
                  value={userId}
                  onChange={(e) => setuserId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">Sign In</button>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-button google">
                <span className="social-icon">G</span>
                <span>Google</span>
              </button>
              <button type="button" className="social-button facebook">
                <span className="social-icon">f</span>
                <span>Facebook</span>
              </button>
            </div>

            <p className="signup-prompt">
              Don't have an account? <Link to="/Register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;