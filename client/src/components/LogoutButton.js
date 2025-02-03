import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear authentication state
    };

    return (<button className="btn btn-primary logout-btn" onClick={handleLogout}> Logout </button>);
};

export default LogoutButton;
