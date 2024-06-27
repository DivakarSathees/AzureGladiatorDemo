import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../apiconfig';

function SignupForm() {
  const navigate = useNavigate();
  const[error,setError]=useState("")

  const [formData, setFormData] = useState({
    userName: '',
    password: '', // Add password field
    confirmPassword: '', // Add confirm password field
    role: 'user',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    
  }

  const validateField = (fieldName, value) => {
    const fieldErrors = { ...errors };
    console.log("fieldName",fieldName);

    switch (fieldName) {
      case 'userName':
        fieldErrors.userName=value.length>0?'':"User Name is required"
        break
      case 'password':
      
        fieldErrors.password =value.length >= 6 ? "" : 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        fieldErrors.confirmPassword =
          value === formData.password ? '' : 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  }

  async function handleSubmit(){
    const fieldErrors = { ...errors };

    // Check if required fields are empty
    if (formData.userName.trim() === '') {
      fieldErrors.userName = 'User Name is required';
    } else {
      fieldErrors.userName = '';
    }
    if (formData.password === '') {
      fieldErrors.password = 'Password is required';
    }
    if (formData.confirmPassword === '') {
      fieldErrors.confirmPassword = 'Confirm Password is required';
    }
    else if (formData.confirmPassword !== formData.password) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }else {
      fieldErrors.confirmPassword = '';
    }

    setErrors(fieldErrors);

    const hasErrors = Object.values(fieldErrors).some((error) => error !== '');
    if (!hasErrors) {
      console.log('Form data:', formData);

      let requestObject={
        "username": formData.userName,
        "password": formData.password,
        "role": formData.role
      }



      console.log('requestObject', requestObject);

      try {
        const response = await axios.post(apiUrl+'/api/Auth/register', requestObject);
        console.log('Response:', response.data);

        if(response.status==200)
        {
          navigate("/user/login")
        }
        else{
          setError("Something went wrong, Please try with different data")
        }
      } catch (error) {
        setError("Something went wrong, Please try with different data")
      }


    }
  }

  const handleLogin = () => {
    console.log('Login clicked');
  }

  return (
    <div className="signup-form-container">
      <h2>Signup</h2>
      <div className="signup-form">
        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="User Name"
          />
          {errors.userName && <div className="error">{errors.userName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select   id="role" name="role" value={formData.role} onChange={handleChange}>
            <option  value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error&&<span id="login_error">{error}</span>}

        <button type="submit" className="submit-button" onClick={()=>{
          handleSubmit()
        }}>
          Submit
        </button>
        <button type="button" className="login-button" onClick={handleLogin}>
          Already have an Account? <Link to="/user/login">Login</Link>
        </button>
      </div>
    </div>
  );
}

export default SignupForm;
