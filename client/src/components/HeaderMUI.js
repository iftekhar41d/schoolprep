import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import LogoutButton from './LogoutButton.js';
import WelcomeMessage from './WelcomeMessage.js';
import '../index.css';

function Header() {
  const navigate = useNavigate();
  const { loggedinUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  }; 
 
 return (    
  <AppBar position='static'
          sx={{
            width:'100%',
            backgroundColor:'#36C2CE',
            margin: 'auto',
            padding: '16px 32px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
            color: '#EBEAFF',
            }}
   >
    <Toolbar >
      {/* Logo and Brand */}
      <img src='/light.png' alt='Logo' className='logo'/> 
      <Typography variant="h4" 
                  component="div" 
                  sx={{ flexGrow: 1,
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 'bold',
                      }}>
          Aadi & Rishi Prep!
        </Typography>

      {loggedinUser?(          
          <div className="custom-header-position">
            {/* Navigation Links */}            
            <div>
            <IconButton color="inherit" component={Link} to="/dashboard" aria-label="home" sx={{ fontSize: '2rem', padding: '12px' }}>
              <HomeIcon />
            </IconButton>
            <Button color="inherit" component={Link} to="/stats" sx={{ fontSize: '1.0rem', padding: '12px 24px' }} >
              Stats
            </Button>
            <Button color="inherit" component={Link} to="/profile" sx={{ fontSize: '1.0rem', padding: '12px 24px' }} >
              My Profile
            </Button>

            {/* Admin Dropdown */}
            <Button
              color="inherit"
              sx={{ fontSize: '1.0rem', padding: '12px 24px' }} 
              onClick={handleMenuOpen}
            >
              Admin
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{"& .MuiMenu-paper": 
                {backgroundColor: '#37B7C3', 
                padding: '12px 24px',
                color: '#F8FAFC',
              }}} 
            >
              <MenuItem component={Link} to="/admin-metadata" onClick={handleMenuClose}>
                Manage Metadata
              </MenuItem>
              <MenuItem component={Link} to="/admin-lessons" onClick={handleMenuClose}>
                Manage Lessons
              </MenuItem>
              <MenuItem component={Link} to="/admin-exercise" onClick={handleMenuClose}>
                Manage Exercise
              </MenuItem>
              <MenuItem component={Link} to="/admin-exams" onClick={handleMenuClose}>
                Manage Exams
              </MenuItem>
              <MenuItem component={Link} to="/admin-users" onClick={handleMenuClose}>
                Manage Users
              </MenuItem>
            </Menu>
            </div>    


            {/* Welcome message right aligned*/}
            <Box sx={{ display: "flex", alignItems: "right", ml: "auto" }}>
                <WelcomeMessage />
                <LogoutButton />
            </Box>

          </div>): (
          <div className="d-flex">
            <button className='btn btn-light header-btn' onClick={goToLogin}> Login </button>
            <button className="btn btn-primary header-btn" onClick={goToRegister} > Sign-up </button>
         </div>)
      }
      </Toolbar>
   </AppBar>
  );
}

export default Header;