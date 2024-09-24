import React, { useState, useEffect, useContext } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { userContext } from '../App';

function LoginSignup() {

  const [state, setState] = useState("Login");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [registerStep, setRegisterStep] = useState(1);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const { setIsLoading } = useContext(userContext);

  useEffect(() => {
    document.title = 'A-Kart - Login';

    if (state === 'Login') {
      const storedEmail = localStorage.getItem('email') || '';
      const storedPassword = localStorage.getItem('password') || '';
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, [state]);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@(?:gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
    return re.test(email);
  };

  const showPassword = () => {
    let password = document.getElementById("inputPassword");
    let checkbox = document.getElementById("check");
    if (checkbox.checked) {
      password.type = "text";
      if (state === "Signup") {
        let rePassword = document.getElementById("reinputPassword");
        rePassword.type = "text";
      }
    } else {
      password.type = "password";
      if (state === "Signup") {
        let rePassword = document.getElementById("reinputPassword");
        rePassword.type = "password";
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !rePassword) {
      alert("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== rePassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`https://a-kart-backend.onrender.com/auth/register`, { name, email, password });
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      setAlertMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setAlertMessage('');
        setState('Login');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.status === 409) {
        alert("Email is already registered.");
      } else {
        console.error(err);
        alert("An error occurred. Please try again.");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://a-kart-backend.onrender.com/auth/login`, { email, password });
      console.log('Response from server:', res.data);
      const tempToken = localStorage.getItem("cartItems");
      if (tempToken) {
        localStorage.removeItem("cartItems");
      }

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        try {
          const decoded = jwtDecode(res.data.token);
          if (decoded.role === 'admin') {
            navigate('/admin');
            window.location.reload();
            console.log("admin is logged in");
          }
          else{
            console.log("admin is not logged in, User is logged in");
            navigate('/');
          }
        } catch (error) {
          console.error('Invalid token:', error.message);
          alert("Invalid token received");
        }
      } else {
        alert(res.data.error || "Invalid Credentials");
        console.log(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Invalid email or password.");
      } else {
        console.error(err);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleRequestOtp = async () => {
    try {
      console.log('Requesting OTP for email:', email);
      const response = await axios.post(`https://a-kart-backend.onrender.com/auth/forgotpassword`, { email });
      console.log('OTP request response:', response.data);
      setForgotPasswordStep(2);
    } catch (err) {
      console.error('Error requesting OTP:', err);
      alert('Error requesting OTP');
    }
  };



  const handleVerifyOtp = async () => {
    try {
      const payload = { email, otp };
      console.log('Verifying OTP with data:', payload);
      const response = await axios.post(`https://a-kart-backend.onrender.com/auth/verifyotp`, payload);
      console.log('OTP verified successfully:', response.data);
      setForgotPasswordStep(3);
    } catch (err) {
      if (err.response) {
        console.error('Server responded with error:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      alert('Error verifying OTP');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    try {
      console.log('Updating password with data:', { email, otp, newPassword });
      await axios.post(`https://a-kart-backend.onrender.com/auth/updatepassword`, { email, otp, newPassword });
      alert('Password updated successfully');
      setForgotPasswordStep(1);
      setState("Login");
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Error updating password');
    }
  };


  return (
    <div className="outer">
      <div className="inner">
        <div className="inner-left">
          {/* Left side content */}
        </div>
        <div className="inner-right">
          {forgotPasswordStep === 1 && state === "ForgotPassword" && (
            <div>
              <h2>Forgot Password</h2>
              <input className="form-control" id="exampleFormControlInput1" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className='login-btn forgot-pass' onClick={handleRequestOtp}>Request OTP</button>
              <button className='login-btn forgot-pass' onClick={() => setState("Login")}>Back to Login</button>
            </div>
          )}
          {forgotPasswordStep === 2 && state === "ForgotPassword" && (
            <div>
              <h2>Verify OTP</h2>
              <input className="form-control" id="exampleFormControlInput1" type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button className='login-btn forgot-pass' onClick={handleVerifyOtp}>Verify OTP</button>
              <button className='login-btn forgot-pass' onClick={() => setForgotPasswordStep(1)}>Back</button>
            </div>
          )}
          {forgotPasswordStep === 3 && state === "ForgotPassword" && (
            <div>
              <h2>Update Password</h2>
              <input className="form-control" id="exampleFormControlInput1" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button className='login-btn forgot-pass' onClick={handleUpdatePassword}>Update Password</button>
              <button className='login-btn forgot-pass' onClick={() => setForgotPasswordStep(1)}>Back</button>
            </div>
          )}
          {state !== "ForgotPassword" && (
            <form onSubmit={(e) => { state === "Login" ? handleSubmit(e) : handleRegister(e) }}>
              {state === "Signup" && (
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name:</label>
                  <input type="text" id="name" className="form-control" onChange={(e) => setName(e.target.value)} placeholder='Your name' />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address:</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Type email" onChange={(e) => setEmail(e.target.value)} value={email} />
              </div>
              <label htmlFor="inputPassword" className="form-label">Password:</label>
              <input type="password" id="inputPassword" placeholder='Type password' className="form-control mb-3" aria-describedby="passwordHelpBlock" onChange={(e) => setPassword(e.target.value)} value={password} />
              {state === "Signup" && (
                <>
                  <label htmlFor="reinputPassword" className="form-label">Enter again:</label>
                  <input type="password" id="reinputPassword" className="form-control" aria-describedby="passwordHelpBlock" onChange={(e) => setRePassword(e.target.value)} placeholder='Re-enter password' />
                </>
              )}
              <div className="form-check my-2">
                <input className="form-check-input checkbox" type="checkbox" value="" id="check" onClick={showPassword} />
                <label className='mb-2 checkbox-style check-label' htmlFor='check'>
                  Show Password
                </label>
              </div>
              <div id="passwordHelpBlock" className='form-pass-text'>
                Your password must be 8-20 characters long, contain letters and numbers.
              </div>
              <div className='button-view'>
                <button className='login-btn btn btn-dark w-100 mb-3' type="submit">{state}</button>
                {state === "Login" ? (
                  <div><span className='text-center'>New user? </span><span className='span' onClick={() => { setState("Signup") }}>Register!</span></div>
                ) : (
                  <div><span className='text-center'>Already registered? </span><span className='span' onClick={() => { setState("Login") }}>Login!</span></div>
                )}
                {state === "Login" && (
                  <div><span className='text-center'>Forgot Password? </span><span className='span' onClick={() => { setState("ForgotPassword") }}>Click here!</span></div>
                )}
              </div>
            </form>
          )}
          {alertMessage && <div className="alert alert-success mt-3" role="alert">{alertMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
