import React, { useContext } from 'react';
import { AuthContext } from './AuthContext.js';

function WelcomeMessage() {
    const { loggedinUser, profileImage } = useContext(AuthContext);

  return (
    <div className='container welcome-msg'>
        {loggedinUser &&(
          <div className='welcome-content'> 
            <img
                src={`/profile/${profileImage}`}
                alt="Profile"
                className='welcome-profile-img'/>
            <p>Welcome, {loggedinUser}</p>
          </div>
        )}
    </div>
  )
}

export default WelcomeMessage;