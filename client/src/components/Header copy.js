import React, { useContext } from 'react';
import { AuthContext } from './AuthContext.js';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import LogoutButton from './LogoutButton.js';
import WelcomeMessage from './WelcomeMessage.js';

function Header() {
  const navigate = useNavigate();
  const { loggedinUser } = useContext(AuthContext);

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  }; 
 
 return (
    <div className='navbar page-header'> 
         
        <div className='logo-container'>
            <img src='/light.png' alt='Logo' className='logo'/>        
            <h1>Aadi & Rishi Prep!</h1>
        </div>

      {loggedinUser?(          
          <div className="d-flex">
            <WelcomeMessage />
            <LogoutButton />
          </div>): (
          <div className="d-flex">
            <button className='btn btn-light header-btn' onClick={goToLogin}> Login </button>
            <button className="btn btn-primary header-btn" onClick={goToRegister} > Sign-up </button>
         </div>)
      }
    </div>
  )
}

export default Header;