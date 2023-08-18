import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login'
import Signup from '../components/Signup';

function HomePage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if(!userInfo) {
          navigate("/");
      }
  }, [navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <div id='outer-box'>
      <div className='login-signup'>
        <div id='login-div'>
          {/* <a href='/login'>Login</a> */}
          <button className="home-btn" onClick={handleLoginClick}>Login</button>
        </div>
        <div id='signup-div'>
          {/* <a href='/signup'>Sign Up</a> */}
          <button className="home-btn" onClick={handleSignupClick}>Signup</button>
        </div>
      </div>
      <div className='login-signup'>
        {showLogin && <Login />}
        {showSignup && <Signup />}
      </div>
    </div>
  );
}

export default HomePage;