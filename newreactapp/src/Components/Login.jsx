import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

function Login() {
  const navigate = useNavigate();
const[error,setError]=useState("")
  const [formData, setFormData] = useState({
    username: '',
    password: '', // Change the field name to "password"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {

    const fieldErrors = { ...errors };

    switch (fieldName) {
      case 'username':
        fieldErrors.username = value.length > 0 ? '' : 'Username is required';
        break;

      case 'password':
        // Add password validation rules here if needed
        fieldErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  async function handleLogin () {
    console.log('Login clicked');
    // Simulate a successful login by calling the login function

    // let role = "user"; // Set the default role to 'admin'

    if (formData.username.trim() === '' || formData.password.trim() === '') {
      setErrors({
        username: formData.username.trim() === '' ? 'Username is required' : errors.username,
        password: formData.password.trim() === '' ? 'Password is required' : errors.password,
      });
      return
    }
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
      // If no errors, proceed with the Axios call
  try {
    // Create the request object with your data
    let requestObject = {
      username: formData.username,
      password: formData.password,
    };

    console.log('requestObject', requestObject);

    // Send a POST request using Axios with async/await
    const response = await axios.post(apiUrl+'/api/Auth/login',requestObject);
console.log("response",response)
    // Handle the response herefv
    // If the login is successful, you can navigate to the desired page
    if (response.status==200) {
      localStorage.setItem("role",response.data.roles[0])
      localStorage.setItem("userId",response.data.userId)
      localStorage.setItem("userName",response.data.username)
      localStorage.setItem("isAuthenticated","true")

      if(response.data.roles[0]=="admin")
      {
        navigate('/home');
      }
      else{
        navigate("/availableloan")
      }

    }
    else{
      setError("Invalid Password or Email")
    }
  } catch (error) {
    // Handle any errors
    setError("Invalid Password or Email")

  }


};

  return (
    <div className="login-box">
      <h2>Login</h2>
      <div className="login-form">
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        {error&&<span id="login_error">{error}</span>}
        <button type="submit" className="login-button" onClick={handleLogin}>
          Login
        </button>
        <div className="signup-link">
          Don't have an account?<Link to="/user/register">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
