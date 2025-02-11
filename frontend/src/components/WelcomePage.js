import React, { useState } from "react";
import axios from "axios";
import PortfolioDashboard from "./PortfolioDashboard";
import "./WelcomePage.css";

const WelcomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  // Validate input fields
  const validateInput = (name, value) => {
    switch (name) {
      case 'name':
        return /^[A-Za-z ]+$/.test(value) ? '' : 'Name should only contain alphabets';
      case 'email':
        return /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email address';
      case 'phoneNumber':
        return /^\d{10}$/.test(value) ? '' : 'Phone number must be exactly 10 digits';
      case 'password':
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? ''
          : 'Password must include uppercase, lowercase, number, and special character';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Passwords do not match';
      default:
        break;
    }
    return "";
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const validationError = validateInput(name, value);
    setErrors({ ...errors, [name]: validationError });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        withCredentials: true
      });

      console.log('Login/Registration response:', response.data); 

      if (isLogin) {
        console.log(response.data.user);
        setUser(response.data.user);
      } else {
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  if (user) {
    return <PortfolioDashboard user={user} setUser={setUser} />;
  }

  return (
    <div className="welcome-page">
      <div className="welcome-header">
        <h1>Welcome to Investment Analytics Portfolio</h1>
        <p>Manage your investments with ease</p>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? "Login" : "Register"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <div className="error-text">{errors.name}</div>}

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <div className="error-text">{errors.email} </div>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && (!isLogin && (<div className="error-text">{errors.password}</div>))}

            {!isLogin && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
              </>
            )}

            <button type="submit" onClick={() => console.log("Login button clicked")}>
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <div className="toggle-section">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
